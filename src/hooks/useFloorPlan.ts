import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { useRoomIssuesStatus } from '@/hooks/useIssues';
import type { Room, Building } from '@/types';

interface FloorPlanRoom extends Room {
  hasIssues: boolean;
}

export function useFloorPlan() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<string>('');
  const [selectedFloor, setSelectedFloor] = useState<number>(1);
  const [rooms, setRooms] = useState<FloorPlanRoom[]>([]);
  const [loading, setLoading] = useState(true);
  const { roomIssueCounts } = useRoomIssuesStatus();

  const fetchBuildings = useCallback(async () => {
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .eq('is_active', true)
      .order('name');

    if (error) console.error('Error fetching buildings:', error);
    else {
      const activeBuildings = (data as Building[]) || [];
      setBuildings(activeBuildings);
      // Default to the first building without making this callback depend on
      // the current selection (which caused an extra fetch on every change).
      setSelectedBuilding((prev) => prev || activeBuildings[0]?.name || '');
    }
  }, []);

  const fetchRooms = useCallback(async () => {
    if (!selectedBuilding) {
      // No buildings yet: stop the spinner instead of loading forever.
      setRooms([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('rooms')
      .select('*')
      .eq('building', selectedBuilding)
      .eq('floor', selectedFloor)
      .eq('is_active', true)
      .order('room_number');

    if (error) {
      console.error('Error fetching rooms:', error);
    } else {
      const roomsWithStatus = await Promise.all(
        (data || []).map(async (room) => {
          const { data: bookings } = await supabase
            .from('bookings')
            .select('*')
            .eq('room_id', room.id)
            .eq('status', 'confirmed')
            .lte('start_time', new Date().toISOString())
            .gte('end_time', new Date().toISOString())
            .limit(1);

          return {
            ...room,
            current_booking: bookings?.[0] || null,
            status: bookings?.[0] ? 'occupied' : 'available',
            hasIssues: (roomIssueCounts[room.id] || 0) > 0,
          } as FloorPlanRoom;
        })
      );

      // Mark rooms with issues as maintenance
      const roomsWithMaintenance = roomsWithStatus.map((room) => ({
        ...room,
        status: room.hasIssues ? 'maintenance' : room.status,
      }));

      setRooms(roomsWithMaintenance);
    }
    setLoading(false);
  }, [selectedBuilding, selectedFloor, roomIssueCounts]);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  useEffect(() => {
    fetchRooms();
  }, [fetchRooms]);

  function getFloorCount(): number {
    const building = buildings.find((b) => b.name === selectedBuilding);
    return building?.floors || 5;
  }

  const selectedBuildingObj = buildings.find((b) => b.name === selectedBuilding) || null;

  return {
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    selectedBuildingObj,
    selectedFloor,
    setSelectedFloor,
    rooms,
    loading,
    floorCount: getFloorCount(),
    refetch: fetchRooms,
  };
}
