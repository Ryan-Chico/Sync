import { Calendar, Clock, User } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { formatDate, formatTime } from '@/lib/utils';
import type { Booking } from '@/types';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  showRoom?: boolean;
  showUser?: boolean;
}

export function BookingCard({ booking, onCancel, showRoom, showUser }: BookingCardProps) {
  const statusVariant = {
    confirmed: 'success' as const,
    cancelled: 'danger' as const,
    completed: 'default' as const,
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h4 className="font-semibold text-gray-900">{booking.title}</h4>
          {booking.description && (
            <p className="text-sm text-gray-500 mt-0.5">{booking.description}</p>
          )}
        </div>
        <Badge variant={statusVariant[booking.status]}>{booking.status}</Badge>
      </div>

      <div className="space-y-1.5 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span>{formatDate(booking.start_time)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{formatTime(booking.start_time)} - {formatTime(booking.end_time)}</span>
        </div>
        {showRoom && booking.room && (
          <div className="flex items-center gap-2">
            <span className="text-gray-400">🏢</span>
            <span>{booking.room.name} (Room {booking.room.room_number})</span>
          </div>
        )}
        {showUser && booking.user && (
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-gray-400" />
            <span>{booking.user.full_name}</span>
          </div>
        )}
      </div>

      {booking.status === 'confirmed' && onCancel && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <button
            onClick={() => onCancel(booking.id)}
            className="text-sm text-red-600 hover:text-red-800 font-medium"
          >
            Cancel Booking
          </button>
        </div>
      )}
    </div>
  );
}
