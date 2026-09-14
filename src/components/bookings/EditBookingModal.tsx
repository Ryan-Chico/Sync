import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useBookings } from '@/hooks/useBookings';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import type { Booking } from '@/types';

interface EditBookingModalProps {
  booking: Booking | null;
  isOpen: boolean;
  onClose: () => void;
}

export function EditBookingModal({ booking, isOpen, onClose }: EditBookingModalProps) {
  const { user } = useAuth();
  const { updateBooking } = useBookings();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: today,
    startTime: '09:00',
    endTime: '10:00',
  });

  useEffect(() => {
    if (booking) {
      const start = new Date(booking.start_time);
      const end = new Date(booking.end_time);
      setFormData({
        title: booking.title,
        description: booking.description || '',
        date: start.toISOString().split('T')[0],
        startTime: start.toTimeString().slice(0, 5),
        endTime: end.toTimeString().slice(0, 5),
      });
    }
  }, [booking]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !booking) return;
    setLoading(true);
    setError('');

    try {
      const start = new Date(`${formData.date}T${formData.startTime}:00`);
      const end = new Date(`${formData.date}T${formData.endTime}:00`);

      if (end <= start) {
        throw new Error('End time must be after start time');
      }

      await updateBooking({
        id: booking.id,
        title: formData.title,
        description: formData.description || null,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
      });

      onClose();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to update booking';
      if (message.includes('already booked') || message.includes('overlap') || message.includes('conflict')) {
        setError('This room is already booked for the selected time. Please choose a different time.');
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            Edit Booking
          </h3>
          {booking?.room && (
            <p className="text-sm text-gray-500">
              {booking.room.name} &middot; Room {booking.room.room_number}
            </p>
          )}
        </div>

        <Input
          label="Meeting Title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          placeholder="e.g. Team Meeting"
          required
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Meeting agenda or notes"
          />
        </div>

        <Input
          label="Date"
          type="date"
          value={formData.date}
          onChange={(e) => setFormData({ ...formData, date: e.target.value })}
          min={today}
          required
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Time"
            type="time"
            value={formData.startTime}
            onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
            required
          />
          <Input
            label="End Time"
            type="time"
            value={formData.endTime}
            onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
            required
          />
        </div>

        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <Button type="button" variant="secondary" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={loading} className="flex-1">
            {loading ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
