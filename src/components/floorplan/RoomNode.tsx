import { cn } from '@/lib/utils';
import type { Room } from '@/types';

interface FloorPlanRoomProps {
  room: Room;
  hasIssues: boolean;
  onClick: () => void;
  isSelected: boolean;
}

export function RoomNode({ room, hasIssues, onClick, isSelected }: FloorPlanRoomProps) {
  const status = room.status || 'available';

  const statusColors = {
    available: {
      fill: 'fill-green-100',
      stroke: 'stroke-green-400',
      text: 'text-green-800',
    },
    occupied: {
      fill: 'fill-red-100',
      stroke: 'stroke-red-400',
      text: 'text-red-800',
    },
    maintenance: {
      fill: 'fill-yellow-100',
      stroke: 'stroke-yellow-400',
      text: 'text-yellow-800',
    },
  };

  const colors = statusColors[status];
  const x = room.floor_plan_x || 0;
  const y = room.floor_plan_y || 0;
  const width = room.floor_plan_width || 120;
  const height = room.floor_plan_height || 80;

  return (
    <g
      onClick={onClick}
      className="cursor-pointer"
      role="button"
      aria-label={`Room ${room.room_number} - ${room.name}`}
    >
      {/* Room rectangle */}
      <rect
        x={x}
        y={y}
        width={width}
        height={height}
        rx={8}
        className={cn(colors.fill, colors.stroke, 'stroke-2 transition-colors')}
        strokeWidth={isSelected ? 3 : 2}
      />

      {/* Selected indicator */}
      {isSelected && (
        <rect
          x={x - 3}
          y={y - 3}
          width={width + 6}
          height={height + 6}
          rx={10}
          className="fill-none stroke-blue-500 stroke-2 stroke-dasharray-4"
        />
      )}

      {/* Room number */}
      <text
        x={x + width / 2}
        y={y + height / 2 - 8}
        textAnchor="middle"
        className="fill-gray-900 text-sm font-bold"
        style={{ fontSize: '14px' }}
      >
        {room.room_number}
      </text>

      {/* Room name */}
      <text
        x={x + width / 2}
        y={y + height / 2 + 10}
        textAnchor="middle"
        className="fill-gray-600"
        style={{ fontSize: '10px' }}
      >
        {room.name.length > 15 ? room.name.slice(0, 15) + '...' : room.name}
      </text>

      {/* Status indicator dot */}
      <circle
        cx={x + width - 12}
        cy={y + 12}
        r={6}
        className={cn(
          status === 'available' ? 'fill-green-500' :
          status === 'occupied' ? 'fill-red-500' :
          'fill-yellow-500'
        )}
      />

      {/* Issue warning icon */}
      {hasIssues && (
        <text
          x={x + 12}
          y={y + 16}
          className="fill-yellow-600"
          style={{ fontSize: '14px' }}
        >
          ⚠
        </text>
      )}
    </g>
  );
}
