import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, RefreshCw, Box, LayoutGrid } from 'lucide-react';
import { useFloorPlan } from '@/hooks/useFloorPlan';
import { FloorSelector } from '@/components/floorplan/FloorSelector';
import { FloorPlanView } from '@/components/floorplan/FloorPlanView';
import { FloorPlanLegend } from '@/components/floorplan/FloorPlanLegend';
import { Building3DView } from '@/components/floorplan/Building3DView';
import { BookingForm } from '@/components/bookings/BookingForm';
import { ReportIssueModal } from '@/components/rooms/ReportIssueModal';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import type { Room } from '@/types';

export function FloorPlan() {
  const navigate = useNavigate();
  const {
    buildings,
    selectedBuilding,
    setSelectedBuilding,
    selectedFloor,
    setSelectedFloor,
    rooms,
    loading,
    floorCount,
    refetch,
  } = useFloorPlan();

  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [viewMode, setViewMode] = useState<'2d' | '3d'>('3d');

  function handleRoomClick(room: Room) {
    setSelectedRoom(room);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back
      </button>

      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Floor Plan</h1>
          <p className="text-gray-600 mt-1">Interactive room view with real-time status</p>
        </div>
        <div className="flex items-center gap-2">
          {/* View Mode Toggle */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('2d')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === '2d'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
              2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                viewMode === '3d'
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Box className="w-4 h-4" />
              3D
            </button>
          </div>
          <button
            onClick={() => refetch()}
            className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Floor Selector */}
      <div className="mb-6">
        <FloorSelector
          buildings={buildings}
          selectedBuilding={selectedBuilding}
          onBuildingChange={setSelectedBuilding}
          selectedFloor={selectedFloor}
          onFloorChange={setSelectedFloor}
          floorCount={floorCount}
        />
      </div>

      {/* Legend */}
      <div className="mb-4">
        <FloorPlanLegend />
      </div>

      {/* Floor Plan */}
      <div className="relative">
        {loading && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/80 rounded-xl">
            <Spinner size="lg" />
          </div>
        )}
        {viewMode === '3d' ? (
          <Building3DView
            rooms={rooms}
            floors={floorCount}
            selectedFloor={selectedFloor}
            onFloorChange={setSelectedFloor}
            onRoomClick={handleRoomClick}
          />
        ) : (
          <FloorPlanView
            rooms={rooms}
            onRoomClick={handleRoomClick}
            selectedRoomId={selectedRoom?.id || null}
          />
        )}
      </div>

      {/* Room Info Modal */}
      {selectedRoom && (
        <div
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50"
          onClick={() => setSelectedRoom(null)}
        >
          <div
            className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-12 h-1 bg-gray-300 rounded-full mx-auto mb-4" />

            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">{selectedRoom.name}</h3>
                <p className="text-gray-500">
                  Room {selectedRoom.room_number} &middot; {selectedRoom.building} &middot; Floor {selectedRoom.floor}
                </p>
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
                {selectedRoom.status === 'available'
                  ? 'Available'
                  : selectedRoom.status === 'occupied'
                  ? 'Occupied'
                  : 'Issues'}
              </span>
            </div>

            <div className="text-sm text-gray-600 mb-4">
              <p>Capacity: {selectedRoom.capacity}</p>
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
                  onClick={() => setShowBookingModal(true)}
                  className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition-colors"
                >
                  Occupy
                </button>
              )}
              <button
                onClick={() => setShowReportModal(true)}
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

      {/* Modals */}
      {selectedRoom && (
        <>
          <Modal isOpen={showBookingModal} onClose={() => setShowBookingModal(false)}>
            <BookingForm
              room={selectedRoom}
              onSuccess={() => {
                setShowBookingModal(false);
                setSelectedRoom(null);
                refetch();
              }}
            />
          </Modal>

          <ReportIssueModal
            isOpen={showReportModal}
            onClose={() => setShowReportModal(false)}
            room={selectedRoom}
          />
        </>
      )}
    </div>
  );
}
