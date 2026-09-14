import { useState } from 'react';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAdminRooms } from '@/hooks/useRooms';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { BUILDINGS, EQUIPMENT_OPTIONS } from '@/types';
import type { Room } from '@/types';

export function ManageRooms() {
  const navigate = useNavigate();
  const { rooms, loading, createRoom, updateRoom, deleteRoom } = useAdminRooms();
  const [showModal, setShowModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const emptyRoom = {
    room_number: '',
    name: '',
    description: '',
    capacity: 10,
    floor: 1,
    building: 'Main Building',
    equipment: [] as string[],
    image_url: '',
    is_active: true,
    floor_plan_x: 0,
    floor_plan_y: 0,
    floor_plan_width: 120,
    floor_plan_height: 80,
  };

  const [formData, setFormData] = useState(emptyRoom);

  function openCreate() {
    setEditingRoom(null);
    setFormData(emptyRoom);
    setError('');
    setShowModal(true);
  }

  function openEdit(room: Room) {
    setEditingRoom(room);
    setFormData({
      room_number: room.room_number,
      name: room.name,
      description: room.description || '',
      capacity: room.capacity,
      floor: room.floor,
      building: room.building,
      equipment: room.equipment || [],
      image_url: room.image_url || '',
      is_active: room.is_active,
      floor_plan_x: room.floor_plan_x || 0,
      floor_plan_y: room.floor_plan_y || 0,
      floor_plan_width: room.floor_plan_width || 120,
      floor_plan_height: room.floor_plan_height || 80,
    });
    setError('');
    setShowModal(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (editingRoom) {
        await updateRoom(editingRoom.id, formData);
      } else {
        await createRoom(formData);
      }
      setShowModal(false);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to save room';
      setError(message);
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string, name: string) {
    if (!confirm(`Delete "${name}"? This action cannot be undone.`)) return;
    try {
      await deleteRoom(id);
    } catch (err: unknown) {
      console.error('Failed to delete room:', err);
    }
  }

  function toggleEquipment(eq: string) {
    setFormData((prev) => ({
      ...prev,
      equipment: prev.equipment.includes(eq)
        ? prev.equipment.filter((e) => e !== eq)
        : [...prev.equipment, eq],
    }));
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/admin')}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Manage Rooms</h1>
          <p className="text-gray-600 mt-1">{rooms.length} rooms total</p>
        </div>
        <Button onClick={openCreate}>
          <Plus className="w-4 h-4 mr-2" />
          Add Room
        </Button>
      </div>

      {loading ? (
        <Spinner size="lg" />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Building</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Floor</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capacity</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Equipment</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {rooms.map((room) => (
                  <tr key={room.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{room.name}</div>
                      <div className="text-sm text-gray-500">{room.room_number}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{room.building}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{room.floor}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{room.capacity}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 max-w-[200px] truncate">
                      {room.equipment?.join(', ') || '—'}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-1 text-xs rounded-full ${
                          room.is_active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {room.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEdit(room)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      >
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(room.id, room.name)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {rooms.length === 0 && (
            <div className="text-center py-12 text-gray-500">No rooms found</div>
          )}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={showModal} onClose={() => setShowModal(false)}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">
            {editingRoom ? 'Edit Room' : 'Create Room'}
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Room Number"
              value={formData.room_number}
              onChange={(e) => setFormData({ ...formData, room_number: e.target.value })}
              placeholder="101"
              required
            />
            <Input
              label="Room Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Computer Lab"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              placeholder="Room description"
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <Input
              label="Capacity"
              type="number"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: Number(e.target.value) })}
              min={1}
              required
            />
            <Input
              label="Floor"
              type="number"
              value={formData.floor}
              onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              min={1}
              required
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
              <select
                value={formData.building}
                onChange={(e) => setFormData({ ...formData, building: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 text-sm"
              >
                {BUILDINGS.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Equipment</label>
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_OPTIONS.map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => toggleEquipment(eq)}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                    formData.equipment.includes(eq)
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {eq}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
              className="rounded border-gray-300 text-blue-600"
            />
            <label htmlFor="is_active" className="text-sm text-gray-700">Active</label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setShowModal(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={saving} className="flex-1">
              {saving ? 'Saving...' : editingRoom ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}

export default ManageRooms;
