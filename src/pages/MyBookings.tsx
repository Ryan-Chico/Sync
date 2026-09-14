import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { BookingCard } from '@/components/bookings/BookingCard';
import { EditBookingModal } from '@/components/bookings/EditBookingModal';
import { Spinner } from '@/components/ui/Spinner';
import { Calendar } from 'lucide-react';
import type { Booking } from '@/types';

export function MyBookings() {
  const { user } = useAuth();
  const { bookings, loading, cancelBooking } = useBookings(user?.id);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const pastBookings = bookings.filter((b) => b.status === 'cancelled' || b.status === 'completed');

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Bookings</h1>
        <p className="text-gray-600 mt-2">Manage your room reservations</p>
      </div>

      {loading ? (
        <div className="py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Active Bookings */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">
              Active Bookings ({activeBookings.length})
            </h2>
            {activeBookings.length > 0 ? (
              <div className="space-y-3">
                {activeBookings.map((booking) => (
                  <BookingCard
                    key={booking.id}
                    booking={booking}
                    showRoom
                    onCancel={cancelBooking}
                    onEdit={setEditingBooking}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-xl border border-gray-200">
                <Calendar className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No active bookings</p>
              </div>
            )}
          </div>

          {/* Past/Cancelled Bookings */}
          {pastBookings.length > 0 && (
            <div>
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Past Bookings ({pastBookings.length})
              </h2>
              <div className="space-y-3 opacity-75">
                {pastBookings.map((booking) => (
                  <BookingCard key={booking.id} booking={booking} showRoom />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Edit Booking Modal */}
      <EditBookingModal
        booking={editingBooking}
        isOpen={!!editingBooking}
        onClose={() => setEditingBooking(null)}
      />
    </div>
  );
}

export default MyBookings;
