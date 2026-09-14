import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Booking } from '@/types';

export function useBookings(userId?: string, roomId?: string) {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('bookings')
      .select('*, room:rooms(*), user:profiles(*)')
      .order('start_time', { ascending: false });

    if (userId) query = query.eq('user_id', userId);
    if (roomId) query = query.eq('room_id', roomId);

    const { data, error } = await query;
    if (error) console.error('Error fetching bookings:', error);
    else setBookings((data as Booking[]) || []);
    setLoading(false);
  }, [userId, roomId]);

  useEffect(() => {
    fetchBookings();

    const channel = supabase
      .channel('bookings-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'bookings' }, fetchBookings)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchBookings]);

  async function createBooking(booking: {
    room_id: string;
    user_id: string;
    title: string;
    description?: string;
    start_time: string;
    end_time: string;
  }) {
    const { error } = await supabase.from('bookings').insert({
      ...booking,
      status: 'confirmed',
    });
    if (error) throw error;
    fetchBookings();
  }

  async function cancelBooking(id: string) {
    const { error } = await supabase.from('bookings').update({ status: 'cancelled' }).eq('id', id);
    if (error) throw error;
    fetchBookings();
  }

  return { bookings, loading, createBooking, cancelBooking, refetch: fetchBookings };
}
