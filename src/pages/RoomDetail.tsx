import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Users, Wrench, ArrowLeft, Calendar } from 'lucide-react';
import { useRoom } from '@/hooks/useRooms';
import { useBookings } from '@/hooks/useBookings';
import { useAuth } from '@/hooks/useAuth';
import { RoomStatusBadge } from '@/components/rooms/RoomStatusBadge';
import { BookingForm } from '@/components/bookings/BookingForm';
import { BookingCard } from '@/components/bookings/BookingCard';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Spinner } from '@/components/ui/Spinner';
import { formatTime } from '@/lib/utils';
import { useState } from 'react';

export function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user, isAdmin } = useAuth();
  const { room, loading: roomLoading } = useRoom(id);
  const { bookings, loading: bookingsLoading, cancelBooking } = useBookings(undefined, id);
  const [showBookingForm, setShowBookingForm] = useState(false);

  if (roomLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!room) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8 text-center">
        <p className="text-gray-500 text-lg">Room not found</p>
        <Button variant="secondary" onClick={() => navigate('/rooms')} className="mt-4">
          Back to Rooms
        </Button>
      </div>
    );
  }

  const confirmedBookings = bookings.filter((b) => b.status === 'confirmed');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{room.name}</h1>
            <p className="text-gray-500">Room {room.room_number}</p>
          </div>
          <RoomStatusBadge status={room.status || 'available'} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <MapPin className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{room.building}</p>
              <p className="text-xs text-gray-500">Floor {room.floor}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <Users className="w-5 h-5 text-gray-400" />
            <div>
              <p className="text-sm font-medium text-gray-900">{room.capacity} people</p>
              <p className="text-xs text-gray-500">Max capacity</p>
            </div>
          </div>
          {room.equipment && room.equipment.length > 0 && (
            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
              <Wrench className="w-5 h-5 text-gray-400" />
              <div>
                <p className="text-sm font-medium text-gray-900">Equipment</p>
                <p className="text-xs text-gray-500">{room.equipment.join(', ')}</p>
              </div>
            </div>
          )}
        </div>

        {room.current_booking && (
          <div className="p-4 bg-red-50 rounded-lg border border-red-200 mb-4">
            <p className="text-sm font-medium text-red-800">Currently Occupied</p>
            <p className="text-sm text-red-700">
              {room.current_booking.title} &middot; {formatTime(room.current_booking.start_time)} - {formatTime(room.current_booking.end_time)}
            </p>
          </div>
        )}

        {user && room.status === 'available' && (
          <Button onClick={() => setShowBookingForm(true)} className="w-full">
            <Calendar className="w-4 h-4 mr-2" />
            Book This Room
          </Button>
        )}

        {!user && (
          <Button variant="secondary" onClick={() => navigate('/login')} className="w-full">
            Login to Book
          </Button>
        )}
      </div>

      {/* Upcoming Bookings */}
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Bookings</h2>
        {bookingsLoading ? (
          <Spinner />
        ) : confirmedBookings.length > 0 ? (
          <div className="space-y-3">
            {confirmedBookings.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                showUser
                onCancel={
                  user && (booking.user_id === user.id || isAdmin)
                    ? cancelBooking
                    : undefined
                }
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
            <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500">No upcoming bookings</p>
          </div>
        )}
      </div>

      {/* Booking Modal */}
      <Modal isOpen={showBookingForm} onClose={() => setShowBookingForm(false)}>
        <BookingForm
          room={room}
          onSuccess={() => {
            setShowBookingForm(false);
          }}
        />
      </Modal>
    </div>
  );
}
