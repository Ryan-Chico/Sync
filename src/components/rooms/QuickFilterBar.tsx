import { Search, CheckCircle, XCircle, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuickFilterBarProps {
  search: string;
  onSearchChange: (value: string) => void;
  showAvailableOnly: boolean;
  onShowAvailableChange: (value: boolean) => void;
  selectedEquipment: string[];
  onEquipmentToggle: (equipment: string) => void;
  equipmentOptions: readonly string[];
}

export function QuickFilterBar({
  search,
  onSearchChange,
  showAvailableOnly,
  onShowAvailableChange,
  selectedEquipment,
  onEquipmentToggle,
  equipmentOptions,
}: QuickFilterBarProps) {
  return (
    <div className="space-y-3">
      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search rooms..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Quick Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => onShowAvailableChange(!showAvailableOnly)}
          className={cn(
            'flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors',
            showAvailableOnly
              ? 'bg-green-500 text-white'
              : 'bg-white border border-gray-200 text-gray-700 hover:bg-gray-50'
          )}
        >
          {showAvailableOnly ? (
            <CheckCircle className="w-4 h-4" />
          ) : (
            <Filter className="w-4 h-4" />
          )}
          Available Now
        </button>
      </div>

      {/* Equipment Filters */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {equipmentOptions.map((eq) => (
          <button
            key={eq}
            onClick={() => onEquipmentToggle(eq)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors',
              selectedEquipment.includes(eq)
                ? 'bg-blue-500 text-white'
                : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
            )}
          >
            {eq}
          </button>
        ))}
      </div>
    </div>
  );
}
