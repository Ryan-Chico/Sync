import { Link } from 'react-router-dom';
import { Building2, Calendar, Users, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useRooms } from '@/hooks/useRooms';
import { RoomCard } from '@/components/rooms/RoomCard';
import { Spinner } from '@/components/ui/Spinner';

export function Home() {
  const { user, isAdmin } = useAuth();
  const { rooms, loading } = useRooms();

  const totalRooms = rooms.length;
  const availableRooms = rooms.filter((r) => r.status === 'available').length;
  const occupiedRooms = rooms.filter((r) => r.status === 'occupied').length;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Room Tracker</h1>
        <p className="text-gray-600 mt-2">
          {user
            ? 'Find and book rooms for your meetings'
            : 'View room availability across campus'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 rounded-lg">
              <Building2 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalRooms}</p>
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
              <p className="text-2xl font-bold text-gray-900">{availableRooms}</p>
              <p className="text-sm text-gray-500">Available Now</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 rounded-lg">
              <Users className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{occupiedRooms}</p>
              <p className="text-sm text-gray-500">Occupied</p>
            </div>
          </div>
        </div>

        {isAdmin && (
          <Link
            to="/admin"
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-all hover:border-purple-200"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Shield className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-lg font-semibold text-gray-900">Admin</p>
                <p className="text-sm text-gray-500">Dashboard</p>
              </div>
            </div>
          </Link>
        )}
      </div>

      {/* Available Rooms */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Available Rooms</h2>
        <Link to="/rooms" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
          View All →
        </Link>
      </div>

      {loading ? (
        <div className="py-12">
          <Spinner size="lg" />
        </div>
      ) : rooms.filter((r) => r.status === 'available').length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {rooms.filter((r) => r.status === 'available').slice(0, 6).map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8 bg-white rounded-xl border border-gray-200 mb-10">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No rooms available at the moment</p>
        </div>
      )}

      {/* Occupied Rooms */}
      {!loading && rooms.filter((r) => r.status === 'occupied').length > 0 && (
        <>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900">Occupied Rooms</h2>
            <Link to="/rooms" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {rooms.filter((r) => r.status === 'occupied').slice(0, 6).map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
