import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types';

let bookingChannelCounter = 0;

async function fetchBookings(userId?: string, roomId?: string): Promise<Booking[]> {
  let query = supabase
    .from('bookings')
    .select('*, room:rooms(*), user:profiles(*)')
    .order('start_time', { ascending: false });

  if (userId) query = query.eq('user_id', userId);
  if (roomId) query = query.eq('room_id', roomId);

  const { data, error } = await query;
  if (error) throw error;
  return (data as Booking[]) || [];
}

export function useBookings(userId?: string, roomId?: string) {
  const queryClient = useQueryClient();
  const channelId = useRef(`bookings-realtime-${++bookingChannelCounter}`);

  const { data: bookings = [], isLoading: loading } = useQuery({
    queryKey: ['bookings', userId, roomId],
    queryFn: () => fetchBookings(userId, roomId),
  });

  useEffect(() => {
    const channel = supabase
      .channel(channelId.current)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, () => {
        queryClient.invalidateQueries({ queryKey: ['bookings'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const createBooking = useMutation({
    mutationFn: async (booking: {
      room_id: string;
      user_id: string;
      title: string;
      description?: string;
      start_time: string;
      end_time: string;
    }) => {
      const { error } = await supabase.from('bookings').insert({
        ...booking,
        status: 'confirmed',
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const cancelBooking = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  const updateBooking = useMutation({
    mutationFn: async ({ id, ...updates }: {
      id: string;
      title?: string;
      description?: string | null;
      start_time?: string;
      end_time?: string;
    }) => {
      const { error } = await supabase.from('bookings').update(updates).eq('id', id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  });

  return {
    bookings,
    loading,
    createBooking: createBooking.mutateAsync,
    cancelBooking: cancelBooking.mutateAsync,
    updateBooking: updateBooking.mutateAsync,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['bookings'] }),
  };
}
