import { useState } from 'react';
import { CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useIssues } from '@/hooks/useIssues';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/lib/utils';
import type { Room } from '@/types';

interface ReportIssueModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: Room;
}

const EQUIPMENT_LABELS: Record<string, string> = {
  computers: 'Computers',
  projector: 'Projector',
  whiteboard: 'Whiteboard',
  microphone: 'Microphone',
  conference_phone: 'Conference Phone',
};

export function ReportIssueModal({ isOpen, onClose, room }: ReportIssueModalProps) {
  const { user } = useAuth();
  const { reportIssue } = useIssues();
  const [selectedEquipment, setSelectedEquipment] = useState('');
  const [description, setDescription] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!user || !selectedEquipment) return;

    setSaving(true);
    setError('');

    try {
      await reportIssue({ roomId: room.id, equipmentName: selectedEquipment, description, reportedBy: user.id });
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSelectedEquipment('');
        setDescription('');
        setSuccess(false);
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to report issue');
    } finally {
      setSaving(false);
    }
  }

  function handleClose() {
    onClose();
    setSelectedEquipment('');
    setDescription('');
    setError('');
    setSuccess(false);
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      {success ? (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Issue Reported!</h3>
          <p className="text-gray-500 mt-1">Thank you for reporting this issue.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Report Issue</h2>
            <p className="text-sm text-gray-500">
              Room {room.room_number} - {room.name}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              What equipment has an issue?
            </label>
            <div className="grid grid-cols-2 gap-2">
              {(room.equipment || []).map((eq) => (
                <button
                  key={eq}
                  type="button"
                  onClick={() => setSelectedEquipment(eq)}
                  className={cn(
                    'p-3 rounded-lg border-2 text-sm font-medium text-left transition-colors',
                    selectedEquipment === eq
                      ? 'border-red-500 bg-red-50 text-red-700'
                      : 'border-gray-200 hover:border-gray-300 text-gray-700'
                  )}
                >
                  {EQUIPMENT_LABELS[eq] || eq}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Describe the issue (optional)
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="e.g. TV screen is flickering, projector bulb is dim..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 text-red-700 rounded-lg text-sm border border-red-200">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button type="button" variant="secondary" onClick={handleClose} className="flex-1">
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={saving || !selectedEquipment}
              variant="danger"
              className="flex-1"
            >
              {saving ? 'Reporting...' : 'Report Issue'}
            </Button>
          </div>
        </form>
      )}
    </Modal>
  );
}
