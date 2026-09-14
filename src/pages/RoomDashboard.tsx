import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import { useRooms } from '@/hooks/useRooms';
import { useRoomIssuesStatus } from '@/hooks/useIssues';
import { RoomStatusCard } from '@/components/rooms/RoomStatusCard';
import { QuickFilterBar } from '@/components/rooms/QuickFilterBar';
import { ReportIssueModal } from '@/components/rooms/ReportIssueModal';
import { BookingForm } from '@/components/bookings/BookingForm';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { EQUIPMENT_OPTIONS } from '@/types';
import type { Room } from '@/types';

export function RoomDashboard() {
  const navigate = useNavigate();
  const { rooms, loading: roomsLoading, refetch } = useRooms();
  const { roomIssueCounts, loading: issuesLoading } = useRoomIssuesStatus();

  const [search, setSearch] = useState('');
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [selectedEquipment, setSelectedEquipment] = useState<string[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const loading = roomsLoading || issuesLoading;

  const filteredRooms = useMemo(() => {
    let result = rooms;

    // Search filter
    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.name.toLowerCase().includes(s) ||
          r.room_number.toLowerCase().includes(s) ||
          r.building.toLowerCase().includes(s)
      );
    }

    // Available only filter
    if (showAvailableOnly) {
      result = result.filter((r) => r.status === 'available');
    }

    // Equipment filter
    if (selectedEquipment.length > 0) {
      result = result.filter((r) =>
        selectedEquipment.every((eq) => r.equipment?.includes(eq))
      );
    }

    return result;
  }, [rooms, search, showAvailableOnly, selectedEquipment]);

  // Group rooms by building
  const roomsByBuilding = useMemo(() => {
    const grouped: Record<string, Room[]> = {};
    filteredRooms.forEach((room) => {
      if (!grouped[room.building]) grouped[room.building] = [];
      grouped[room.building].push(room);
    });
    return grouped;
  }, [filteredRooms]);

  function handleEquipmentToggle(eq: string) {
    setSelectedEquipment((prev) =>
      prev.includes(eq) ? prev.filter((e) => e !== eq) : [...prev, eq]
    );
  }

  function handleRoomClick(room: Room) {
    setSelectedRoom(room);
  }

  function handleBookNow() {
    setShowBookingModal(true);
  }

  function handleReportIssue() {
    setShowReportModal(true);
  }

  const stats = {
    total: rooms.length,
    available: rooms.filter((r) => r.status === 'available').length,
    occupied: rooms.filter((r) => r.status === 'occupied').length,
    issues: Object.values(roomIssueCounts).reduce((sum, count) => sum + count, 0),
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Room Dashboard</h1>
              <p className="text-sm text-gray-500">Real-time room availability</p>
            </div>
            <button
              onClick={() => refetch()}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            <div className="text-center p-2 bg-gray-50 rounded-lg">
              <p className="text-lg font-bold text-gray-900">{stats.total}</p>
              <p className="text-xs text-gray-500">Total</p>
            </div>
            <div className="text-center p-2 bg-green-50 rounded-lg">
              <p className="text-lg font-bold text-green-700">{stats.available}</p>
              <p className="text-xs text-green-600">Available</p>
            </div>
            <div className="text-center p-2 bg-red-50 rounded-lg">
              <p className="text-lg font-bold text-red-700">{stats.occupied}</p>
              <p className="text-xs text-red-600">Occupied</p>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded-lg">
              <p className="text-lg font-bold text-yellow-700">{stats.issues}</p>
              <p className="text-xs text-yellow-600">Issues</p>
            </div>
          </div>

          {/* Filters */}
          <QuickFilterBar
            search={search}
            onSearchChange={setSearch}
            showAvailableOnly={showAvailableOnly}
            onShowAvailableChange={setShowAvailableOnly}
            selectedEquipment={selectedEquipment}
            onEquipmentToggle={handleEquipmentToggle}
            equipmentOptions={EQUIPMENT_OPTIONS}
          />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        {loading ? (
          <div className="py-12">
            <Spinner size="lg" />
          </div>
        ) : filteredRooms.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
            <AlertTriangle className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">No rooms match your filters</p>
            <p className="text-sm text-gray-400 mt-1">Try adjusting your search criteria</p>
          </div>
        ) : (
          Object.entries(roomsByBuilding).map(([building, buildingRooms]) => (
            <div key={building} className="mb-6">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3">
                {building}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {buildingRooms.map((room) => (
                  <RoomStatusCard
                    key={room.id}
                    room={room}
                    issueCount={roomIssueCounts[room.id] || 0}
                    onClick={() => handleRoomClick(room)}
                  />
                ))}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Room Detail Bottom Sheet */}
      {selectedRoom && (
        <div className="fixed inset-0 z-40 flex items-end justify-center bg-black/50" onClick={() => setSelectedRoom(null)}>
          <div
            className="bg-white rounded-t-2xl w-full max-w-lg p-6 pb-8"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedRoom.name}</h3>
                <p className="text-gray-500">Room {selectedRoom.room_number} &middot; {selectedRoom.building}</p>
              </div>
              <span
                className={`px-3 py-1 rounded-full text-sm font-medium ${
                  selectedRoom.status === 'available'
                    ? 'bg-green-100 text-green-800'
                    : selectedRoom.status === 'occupied'
                    ? 'bg-red-100 text-red-800'
                    : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {selectedRoom.status === 'available' ? 'Available' : selectedRoom.status === 'occupied' ? 'Occupied' : 'Issues'}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>Floor {selectedRoom.floor} &middot; Capacity {selectedRoom.capacity}</p>
              {selectedRoom.equipment && selectedRoom.equipment.length > 0 && (
                <p className="mt-1">Equipment: {selectedRoom.equipment.join(', ')}</p>
              )}
            </div>

            {selectedRoom.current_booking && (
              <div className="p-3 bg-red-50 rounded-lg mb-4 text-sm">
                <p className="font-medium text-red-800">Currently Booked</p>
                <p className="text-red-700">{selectedRoom.current_booking.title}</p>
              </div>
            )}

            <div className="flex gap-3">
              {selectedRoom.status === 'available' && (
                <button
                  onClick={handleBookNow}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Book Now
                </button>
              )}
              <button
                onClick={handleReportIssue}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Report Issue
              </button>
              <button
                onClick={() => navigate(`/rooms/${selectedRoom.id}`)}
                className="px-4 py-3 bg-gray-100 text-gray-700 rounded-xl font-medium hover:bg-gray-200 transition-colors"
              >
                Details
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Report Issue Modal */}
      {selectedRoom && (
        <ReportIssueModal
          isOpen={showReportModal}
          onClose={() => setShowReportModal(false)}
          room={selectedRoom}
        />
      )}

      {/* Booking Modal */}
      {selectedRoom && (
        <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)}>
          <BookingForm
            room={selectedRoom}
            onSuccess={() => {
              setShowBookingModal(false);
              setSelectedRoom(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
}
