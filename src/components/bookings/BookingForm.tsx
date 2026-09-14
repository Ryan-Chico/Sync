import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { Room } from '@/types';

interface BookingFormProps {
  room: Room;
  onSuccess: () => void;
}

export function BookingForm({ room, onSuccess }: BookingFormProps) {
  const { user } = useAuth();
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user) return;
    setLoading(true);
    setError('');

    try {
      const start = new Date(`${formData.date}T${formData.startTime}:00`);
      const end = new Date(`${formData.date}T${formData.endTime}:00`);

      if (end <= start) {
        throw new Error('End time must be after start time');
      }

      const { error: insertError } = await supabase.from('bookings').insert({
        room_id: room.id,
        user_id: user.id,
        title: formData.title,
        description: formData.description || null,
        start_time: start.toISOString(),
        end_time: end.toISOString(),
        status: 'confirmed',
      });

      if (insertError) throw insertError;

      onSuccess();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to create booking';
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-semibold text-gray-900 mb-1">Book {room.name}</h3>
        <p className="text-sm text-gray-500">Room {room.room_number} &middot; {room.building}</p>
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

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Booking...' : 'Book Room'}
      </Button>
    </form>
  );
}
