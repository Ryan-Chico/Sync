import { Link, useNavigate } from 'react-router-dom';
import { Users, MapPin, Wrench, Calendar } from 'lucide-react';
import { RoomStatusBadge } from './RoomStatusBadge';
import { formatTime } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import type { Room } from '@/types';

interface RoomCardProps {
  room: Room;
}

export function RoomCard({ room }: RoomCardProps) {
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleBookNow(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate('/login');
    } else {
      navigate(`/book/${room.id}`);
    }
  }

  return (
    <Link
      to={`/rooms/${room.id}`}
      className="block bg-white rounded-lg shadow-sm hover:shadow-md transition-all p-5 border border-gray-100 hover:border-blue-200"
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg text-gray-900">{room.name}</h3>
          <p className="text-sm text-gray-500">Room {room.room_number}</p>
        </div>
        <RoomStatusBadge status={room.status || 'available'} />
      </div>

      <div className="space-y-2 text-sm text-gray-600">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{room.building}, Floor {room.floor}</span>
        </div>
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-gray-400" />
          <span>Capacity: {room.capacity}</span>
        </div>
        {room.equipment && room.equipment.length > 0 && (
          <div className="flex items-center gap-2">
            <Wrench className="w-4 h-4 text-gray-400" />
            <span className="truncate">{room.equipment.join(', ')}</span>
          </div>
        )}
      </div>

      {room.current_booking && (
        <div className="mt-4 pt-3 border-t border-gray-100">
          <p className="text-xs text-gray-400 mb-1">Currently booked</p>
          <p className="text-sm font-medium text-gray-700 truncate">
            {room.current_booking.title}
          </p>
          <p className="text-xs text-gray-500">
            {formatTime(room.current_booking.start_time)} - {formatTime(room.current_booking.end_time)}
          </p>
        </div>
      )}

      {!room.current_booking && room.status === 'available' && (
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-sm text-green-600 font-medium">Ready to book</p>
          <button
            onClick={handleBookNow}
            className="flex items-center gap-1 px-3 py-1.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Calendar className="w-3.5 h-3.5" />
            Book Now
          </button>
        </div>
      )}
    </Link>
  );
}
