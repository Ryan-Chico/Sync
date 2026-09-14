import { useMemo } from 'react';
import { RoomNode } from './RoomNode';
import type { Room } from '@/types';

interface FloorPlanViewProps {
  rooms: (Room & { hasIssues?: boolean })[];
  onRoomClick: (room: Room) => void;
  selectedRoomId: string | null;
}

interface GridLayout {
  x: number;
  y: number;
  width: number;
  height: number;
}

function calculateGridLayout(roomCount: number): { cols: number; cellWidth: number; cellHeight: number } {
  if (roomCount <= 2) return { cols: 2, cellWidth: 180, cellHeight: 120 };
  if (roomCount <= 4) return { cols: 2, cellWidth: 180, cellHeight: 120 };
  if (roomCount <= 6) return { cols: 3, cellWidth: 160, cellHeight: 110 };
  if (roomCount <= 9) return { cols: 3, cellWidth: 160, cellHeight: 110 };
  return { cols: 4, cellWidth: 140, cellHeight: 100 };
}

function getGridLayout(index: number, cols: number, cellWidth: number, cellHeight: number): GridLayout {
  const padding = 30;
  const gap = 20;
  const col = index % cols;
  const row = Math.floor(index / cols);

  return {
    x: padding + col * (cellWidth + gap),
    y: padding + row * (cellHeight + gap),
    width: cellWidth,
    height: cellHeight,
  };
}

export function FloorPlanView({ rooms, onRoomClick, selectedRoomId }: FloorPlanViewProps) {
  // Sort rooms by room_number for consistent layout
  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => a.room_number.localeCompare(b.room_number));
  }, [rooms]);

  const { cols, cellWidth, cellHeight } = calculateGridLayout(sortedRooms.length);

  // Calculate SVG dimensions
  const rows = Math.ceil(sortedRooms.length / cols);
  const padding = 30;
  const gap = 20;
  const svgWidth = padding * 2 + cols * cellWidth + (cols - 1) * gap;
  const svgHeight = padding * 2 + rows * cellHeight + (rows - 1) * gap;

  const viewBox = `0 0 ${svgWidth} ${svgHeight}`;

  if (rooms.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
        <div className="text-center">
          <p className="text-gray-500 font-medium">No rooms on this floor</p>
          <p className="text-sm text-gray-400 mt-1">Add rooms in Admin → Rooms</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 overflow-auto">
      <svg
        viewBox={viewBox}
        className="w-full h-auto min-h-[300px] max-h-[600px]"
        style={{ touchAction: 'manipulation' }}
      >
        {/* Background grid */}
        <defs>
          <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
            <path d="M 20 0 L 0 0 0 20" fill="none" className="stroke-gray-100" strokeWidth="0.5" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />

        {/* Rooms with auto-calculated positions */}
        {sortedRooms.map((room, index) => {
          const layout = getGridLayout(index, cols, cellWidth, cellHeight);
          const roomWithPosition = {
            ...room,
            floor_plan_x: layout.x,
            floor_plan_y: layout.y,
            floor_plan_width: layout.width,
            floor_plan_height: layout.height,
          };

          return (
            <RoomNode
              key={room.id}
              room={roomWithPosition}
              hasIssues={room.hasIssues || false}
              onClick={() => onRoomClick(room)}
              isSelected={room.id === selectedRoomId}
            />
          );
        })}
      </svg>
    </div>
  );
}
