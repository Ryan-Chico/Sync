import { AlertTriangle, CheckCircle, Clock, Wrench } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Room } from '@/types';

interface RoomStatusCardProps {
  room: Room;
  issueCount: number;
  onClick: () => void;
}

export function RoomStatusCard({ room, issueCount, onClick }: RoomStatusCardProps) {
  const status = room.status || 'available';

  const statusConfig = {
    available: {
      bg: 'bg-green-50 border-green-200 hover:border-green-400',
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      label: 'Available',
      labelColor: 'text-green-700',
      dot: 'bg-green-500',
    },
    occupied: {
      bg: 'bg-red-50 border-red-200 hover:border-red-400',
      icon: <Clock className="w-5 h-5 text-red-600" />,
      label: 'Occupied',
      labelColor: 'text-red-700',
      dot: 'bg-red-500',
    },
    maintenance: {
      bg: 'bg-yellow-50 border-yellow-200 hover:border-yellow-400',
      icon: <Wrench className="w-5 h-5 text-yellow-600" />,
      label: 'Issues',
      labelColor: 'text-yellow-700',
      dot: 'bg-yellow-500',
    },
  };

  const config = statusConfig[status];

  return (
    <button
      onClick={onClick}
      className={cn(
        'w-full p-4 rounded-xl border-2 text-left transition-all active:scale-[0.98]',
        config.bg
      )}
    >
      <div className="flex items-start justify-between mb-2">
        <div>
          <p className="font-bold text-gray-900 text-lg">{room.room_number}</p>
          <p className="text-sm text-gray-600 truncate">{room.name}</p>
        </div>
        <div className="flex items-center gap-1.5">
          {issueCount > 0 && (
            <span className="flex items-center gap-1 px-2 py-0.5 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
              <AlertTriangle className="w-3 h-3" />
              {issueCount}
            </span>
          )}
          {config.icon}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className={cn('w-2 h-2 rounded-full', config.dot)} />
        <span className={cn('text-sm font-medium', config.labelColor)}>{config.label}</span>
      </div>

      {/* Equipment Status */}
      {room.equipment && room.equipment.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {room.equipment.map((eq) => (
            <span
              key={eq}
              className="px-2 py-0.5 bg-white/80 border border-gray-200 rounded text-xs text-gray-600"
            >
              {eq}
            </span>
          ))}
        </div>
      )}

      {room.current_booking && (
        <div className="mt-3 pt-2 border-t border-gray-200/50">
          <p className="text-xs text-gray-500 truncate">
            Booked: {room.current_booking.title}
          </p>
        </div>
      )}
    </button>
  );
}
