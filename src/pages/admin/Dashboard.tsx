import { Link } from 'react-router-dom';
import { Building2, Calendar, Users, Settings } from 'lucide-react';
import { useRooms } from '@/hooks/useRooms';
import { useBookings } from '@/hooks/useBookings';
import { Spinner } from '@/components/ui/Spinner';

export function Dashboard() {
  const { rooms, loading: roomsLoading } = useRooms();
  const { bookings, loading: bookingsLoading } = useBookings();

  const loading = roomsLoading || bookingsLoading;

  const activeBookings = bookings.filter((b) => b.status === 'confirmed');
  const totalCapacity = rooms.reduce((sum, r) => sum + r.capacity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600 mt-2">Manage rooms and view analytics</p>
      </div>

      {loading ? (
        <div className="py-12">
          <Spinner size="lg" />
        </div>
      ) : (
        <>
          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{rooms.length}</p>
                  <p className="text-sm text-gray-500">Total Rooms</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-50 rounded-lg">
                  <Calendar className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{activeBookings.length}</p>
                  <p className="text-sm text-gray-500">Active Bookings</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{totalCapacity}</p>
                  <p className="text-sm text-gray-500">Total Capacity</p>
                </div>
              </div>
            </div>

            <Link
              to="/admin/rooms"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:border-blue-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Building2 className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Rooms</p>
                  <p className="text-sm text-gray-500">Manage rooms</p>
                </div>
              </div>
            </Link>

            <Link
              to="/admin/settings"
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:border-purple-200"
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Settings className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Settings</p>
                  <p className="text-sm text-gray-500">Users, buildings, equipment</p>
                </div>
              </div>
            </Link>
          </div>

          {/* Recent Bookings */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200">
            <div className="p-5 border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Recent Bookings</h2>
            </div>
            <div className="divide-y divide-gray-100">
              {bookings.length > 0 ? (
                bookings.slice(0, 10).map((booking) => (
                  <div key={booking.id} className="p-4 hover:bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-gray-900">{booking.title}</p>
                        <p className="text-sm text-gray-500">
                          {booking.room?.name} &middot; {booking.user?.full_name}
                        </p>
                      </div>
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          booking.status === 'confirmed'
                            ? 'bg-green-100 text-green-800'
                            : booking.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-gray-500">No bookings yet</div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
