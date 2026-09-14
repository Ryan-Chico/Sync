import { useEffect, useRef } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import type { RoomIssue } from '@/types';

let issueChannelCounter = 0;

async function fetchIssues(roomId?: string): Promise<RoomIssue[]> {
  let query = supabase
    .from('room_issues')
    .select('*, room:rooms(*), reporter:profiles!room_issues_reported_by_fkey(*), verifier:profiles!room_issues_verified_by_fkey(*)')
    .order('created_at', { ascending: false });

  if (roomId) query = query.eq('room_id', roomId);

  const { data, error } = await query;
  if (error) throw error;
  return (data as RoomIssue[]) || [];
}

export function useIssues(roomId?: string) {
  const queryClient = useQueryClient();
  const channelId = useRef(`issues-realtime-${++issueChannelCounter}`);

  const { data: issues = [], isLoading: loading } = useQuery({
    queryKey: ['issues', roomId],
    queryFn: () => fetchIssues(roomId),
  });

  useEffect(() => {
    const channel = supabase
      .channel(channelId.current)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_issues' }, () => {
        queryClient.invalidateQueries({ queryKey: ['issues'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const reportIssue = useMutation({
    mutationFn: async ({ roomId, equipmentName, description, reportedBy }: {
      roomId: string;
      equipmentName: string;
      description: string;
      reportedBy: string;
    }) => {
      const { error } = await supabase.from('room_issues').insert({
        room_id: roomId,
        equipment_name: equipmentName,
        description,
        reported_by: reportedBy,
        status: 'reported',
      });
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });

  const verifyIssue = useMutation({
    mutationFn: async ({ issueId, verifiedBy }: { issueId: string; verifiedBy: string }) => {
      const { error } = await supabase
        .from('room_issues')
        .update({ status: 'verified', verified_by: verifiedBy, updated_at: new Date().toISOString() })
        .eq('id', issueId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });

  const fixIssue = useMutation({
    mutationFn: async (issueId: string) => {
      const { error } = await supabase
        .from('room_issues')
        .update({ status: 'fixed', updated_at: new Date().toISOString() })
        .eq('id', issueId);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  });

  return {
    issues,
    loading,
    reportIssue: reportIssue.mutateAsync,
    verifyIssue: verifyIssue.mutateAsync,
    fixIssue: fixIssue.mutateAsync,
    refetch: () => queryClient.invalidateQueries({ queryKey: ['issues'] }),
  };
}

async function fetchRoomIssueCounts(): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from('room_issues')
    .select('room_id')
    .in('status', ['reported', 'verified']);

  if (error) throw error;

  const counts: Record<string, number> = {};
  (data as { room_id: string }[]).forEach((item) => {
    counts[item.room_id] = (counts[item.room_id] || 0) + 1;
  });
  return counts;
}

export function useRoomIssuesStatus() {
  const queryClient = useQueryClient();
  const channelId = useRef(`issues-count-realtime-${++issueChannelCounter}`);

  const { data: roomIssueCounts = {}, isLoading: loading } = useQuery({
    queryKey: ['room-issue-counts'],
    queryFn: fetchRoomIssueCounts,
  });

  useEffect(() => {
    const channel = supabase
      .channel(channelId.current)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'room_issues' }, () => {
        queryClient.invalidateQueries({ queryKey: ['room-issue-counts'] });
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  return { roomIssueCounts, loading, refetch: () => queryClient.invalidateQueries({ queryKey: ['room-issue-counts'] }) };
}
