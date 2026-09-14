import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Room, RoomFilter, Booking } from '@/types';

let roomsChannelCounter = 0;

const defaultFilter: RoomFilter = {
  search: '',
  building: '',
  floor: null,
  capacity: null,
  equipment: [],
  status: 'all',
};

async function fetchRooms(mergedFilter: RoomFilter): Promise<Room[]> {
  let query = supabase
    .from('rooms')
    .select('*')
    .eq('is_active', true)
    .order('room_number');

  if (mergedFilter.building) query = query.eq('building', mergedFilter.building);
  if (mergedFilter.floor) query = query.eq('floor', mergedFilter.floor);
  if (mergedFilter.capacity) query = query.gte('capacity', mergedFilter.capacity);
  if (mergedFilter.equipment.length > 0) {
    query = query.overlaps('equipment', mergedFilter.equipment);
  }

  const { data: roomsData, error } = await query;
  if (error) throw error;
  if (!roomsData) return [];

  const now = new Date().toISOString();
  const roomsWithStatus = await Promise.all(
    roomsData.map(async (room) => {
      const { data: bookings } = await supabase
        .from('bookings')
        .select('*')
        .eq('room_id', room.id)
        .eq('status', 'confirmed')
        .lte('start_time', now)
        .gte('end_time', now)
        .limit(1);

      return {
        ...room,
        current_booking: (bookings as Booking[])?.[0] || null,
        status: (bookings as Booking[])?.[0] ? 'occupied' : 'available',
      } as Room;
    })
  );

  let filtered = roomsWithStatus;
  if (mergedFilter.status !== 'all') {
    filtered = roomsWithStatus.filter((r) => r.status === mergedFilter.status);
  }
  if (mergedFilter.search) {
    const s = mergedFilter.search.toLowerCase();
    filtered = filtered.filter(
      (r) => r.name.toLowerCase().includes(s) || r.room_number.toLowerCase().includes(s)
    );
  }

  return filtered;
}

export function useRooms(filter?: Partial<RoomFilter>) {
  const queryClient = useQueryClient();
  const mergedFilter = { ...defaultFilter, ...filter };
  const channelId = useRef(`rooms-realtime-${++roomsChannelCounter}`);

  const filterKey = [
    mergedFilter.building,
    mergedFilter.floor,
    mergedFilter.capacity,
    mergedFilter.equipment.join(','),
    mergedFilter.status,
    mergedFilter.search,
  ].join('|');

  const { data: rooms = [], isLoading: loading } = useQuery({
    queryKey: ['rooms', filterKey],
    queryFn: () => fetchRooms(mergedFilter),
  });

  useEffect(() => {
    const channel = supabase
      .channel(channelId.current)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, () => {
        queryClient.invalidateQueries({ queryKey: ['rooms'] });
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        queryClient.invalidateQueries({ queryKey: ['rooms'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { rooms, loading, refetch: () => queryClient.invalidateQueries({ queryKey: ['rooms'] }) };
}

async function fetchRoom(id: string): Promise<Room | null> {
  const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
  if (error) throw error;
  return data;
}

export function useRoom(id: string | undefined) {
  const { data: room = null, isLoading: loading } = useQuery({
    queryKey: ['room', id],
    queryFn: () => fetchRoom(id!),
    enabled: !!id,
  });

  return { room, loading };
}

async function fetchAdminRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from('rooms').select('*').order('room_number');
  if (error) throw error;
  return data || [];
}

export function useAdminRooms() {
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading: loading } = useQuery({
    queryKey: ['admin-rooms'],
    queryFn: fetchAdminRooms,
  });

  const createRoom = useMutation({
    mutationFn: async (room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) => {
      const { error } = await supabase.from('rooms').insert(room);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-rooms'] }),
  });

  const updateRoom = useMutation({
    mutationFn: async ({ id, ...updates }: Partial<Room> & { id: string }) => {
      const { error } = await supabase.from('rooms').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-rooms'] }),
  });

  const deleteRoom = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('rooms').delete().eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-rooms'] }),
  });

  return {
    rooms,
    loading,
    createRoom: createRoom.mutateAsync,
    updateRoom: updateRoom.mutateAsync,
    deleteRoom: deleteRoom.mutateAsync,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['admin-rooms'] }),
  };
}
