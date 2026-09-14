import { useState } from 'react';
import { useRooms } from '@/hooks/useRooms';
import { RoomCard } from '@/components/rooms/RoomCard';
import { RoomFilterBar } from '@/components/rooms/RoomFilter';
import { Spinner } from '@/components/ui/Spinner';
import { Building2 } from 'lucide-react';
import type { RoomFilter } from '@/types';

export function Rooms() {
  const [filter, setFilter] = useState<RoomFilter>({
    search: '',
    building: '',
    floor: null,
    capacity: null,
    equipment: [],
    status: 'all',
  });

  const { rooms, loading } = useRooms(filter);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Rooms</h1>
        <p className="text-gray-600 mt-2">Browse and book available rooms</p>
      </div>

      <RoomFilterBar filter={filter} onFilterChange={setFilter} />

      {loading ? (
        <div className="py-12">
          <Spinner size="lg" />
        </div>
      ) : rooms.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {rooms.map((room) => (
            <RoomCard key={room.id} room={room} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No rooms match your filters</p>
        </div>
      )}
    </div>
  );
}
