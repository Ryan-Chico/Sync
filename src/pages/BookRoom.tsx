import { useParams, useNavigate } from 'react-router-dom';
import { useRoom } from '@/hooks/useRooms';
import { BookingForm } from '@/components/bookings/BookingForm';
import { Spinner } from '@/components/ui/Spinner';
import { ArrowLeft } from 'lucide-react';

export function BookRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { room, loading } = useRoom(roomId);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-lg mx-auto px-4 py-8 text-center">
        <p className="text-gray-500">Room not found</p>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <BookingForm
          room={room}
          onSuccess={() => navigate(`/rooms/${room.id}`)}
        />
      </div>
    </div>
  );
}

export default BookRoom;
