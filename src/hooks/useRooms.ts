import { useState, useEffect, useCallback, useRef } from 'react';
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

export function useRooms(filter?: Partial<RoomFilter>) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);
  const mergedFilter = { ...defaultFilter, ...filter };
  const channelId = useRef(`rooms-realtime-${++roomsChannelCounter}`);

  const fetchRooms = useCallback(async () => {
    setLoading(true);

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
    if (error) {
      console.error('Error fetching rooms:', error);
      setLoading(false);
      return;
    }

    if (!roomsData) {
      setRooms([]);
      setLoading(false);
      return;
    }

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

    setRooms(filtered);
    setLoading(false);
  }, [mergedFilter.building, mergedFilter.floor, mergedFilter.capacity, mergedFilter.equipment.join(','), mergedFilter.status, mergedFilter.search]);

  useEffect(() => {
    fetchRooms();

    const channel = supabase
      .channel(channelId.current)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'rooms' }, fetchRooms)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchRooms)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchRooms]);

  return { rooms, loading, refetch: fetchRooms };
}

export function useRoom(id: string | undefined) {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    async function fetchRoom() {
      const { data, error } = await supabase.from('rooms').select('*').eq('id', id).single();
      if (error) console.error('Error fetching room:', error);
      else setRoom(data);
      setLoading(false);
    }

    fetchRoom();
  }, [id]);

  return { room, loading };
}

export function useAdminRooms() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase.from('rooms').select('*').order('room_number');
    if (error) console.error('Error fetching rooms:', error);
    else setRooms(data || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  async function createRoom(room: Omit<Room, 'id' | 'created_at' | 'updated_at'>) {
    const { error } = await supabase.from('rooms').insert(room);
    if (error) throw error;
    fetchRooms();
  }

  async function updateRoom(id: string, updates: Partial<Room>) {
    const { error } = await supabase.from('rooms').update(updates).eq('id', id);
    if (error) throw error;
    fetchRooms();
  }

  async function deleteRoom(id: string) {
    const { error } = await supabase.from('rooms').delete().eq('id', id);
    if (error) throw error;
    fetchRooms();
  }

  return { rooms, loading, createRoom, updateRoom, deleteRoom, refetch: fetchRooms };
}
