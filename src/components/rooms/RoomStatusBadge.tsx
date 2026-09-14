import { cn } from '@/lib/utils';

interface RoomStatusBadgeProps {
  status: 'available' | 'occupied' | 'maintenance';
}

const statusConfig = {
  available: { label: 'Available', className: 'bg-green-100 text-green-800' },
  occupied: { label: 'Occupied', className: 'bg-red-100 text-red-800' },
  maintenance: { label: 'Maintenance', className: 'bg-yellow-100 text-yellow-800' },
};

export function RoomStatusBadge({ status }: RoomStatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={cn('px-2.5 py-0.5 rounded-full text-xs font-medium', config.className)}>
      {config.label}
    </span>
  );
}
