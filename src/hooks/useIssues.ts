import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { RoomIssue } from '@/types';

export function useIssues(roomId?: string) {
  const [issues, setIssues] = useState<RoomIssue[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchIssues = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from('room_issues')
      .select('*, room:rooms(*), reporter:profiles!room_issues_reported_by_fkey(*), verifier:profiles!room_issues_verified_by_fkey(*)')
      .order('created_at', { ascending: false });

    if (roomId) query = query.eq('room_id', roomId);

    const { data, error } = await query;
    if (error) console.error('Error fetching issues:', error);
    else setIssues((data as RoomIssue[]) || []);
    setLoading(false);
  }, [roomId]);

  useEffect(() => {
    fetchIssues();

    const channel = supabase
      .channel('issues-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_issues' }, fetchIssues)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchIssues]);

  async function reportIssue(roomId: string, equipmentName: string, description: string, reportedBy: string) {
    const { error } = await supabase.from('room_issues').insert({
      room_id: roomId,
      equipment_name: equipmentName,
      description,
      reported_by: reportedBy,
      status: 'reported',
    });
    if (error) throw error;
    fetchIssues();
  }

  async function verifyIssue(issueId: string, verifiedBy: string) {
    const { error } = await supabase
      .from('room_issues')
      .update({ status: 'verified', verified_by: verifiedBy, updated_at: new Date().toISOString() })
      .eq('id', issueId);
    if (error) throw error;
    fetchIssues();
  }

  async function fixIssue(issueId: string) {
    const { error } = await supabase
      .from('room_issues')
      .update({ status: 'fixed', updated_at: new Date().toISOString() })
      .eq('id', issueId);
    if (error) throw error;
    fetchIssues();
  }

  return { issues, loading, reportIssue, verifyIssue, fixIssue, refetch: fetchIssues };
}

export function useRoomIssuesStatus() {
  const [roomIssueCounts, setRoomIssueCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchIssueCounts = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('room_issues')
      .select('room_id')
      .in('status', ['reported', 'verified']);

    if (error) {
      console.error('Error fetching issue counts:', error);
    } else {
      const counts: Record<string, number> = {};
      (data as { room_id: string }[]).forEach((item) => {
        counts[item.room_id] = (counts[item.room_id] || 0) + 1;
      });
      setRoomIssueCounts(counts);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchIssueCounts();

    const channel = supabase
      .channel('issues-count-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_issues' }, fetchIssueCounts)
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchIssueCounts]);

  return { roomIssueCounts, loading, refetch: fetchIssueCounts };
}
