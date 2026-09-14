import { Search } from 'lucide-react';
import { BUILDINGS, EQUIPMENT_OPTIONS } from '@/types';
import type { RoomFilter } from '@/types';

interface RoomFilterBarProps {
  filter: RoomFilter;
  onFilterChange: (filter: RoomFilter) => void;
}

export function RoomFilterBar({ filter, onFilterChange }: RoomFilterBarProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <div className="relative lg:col-span-2">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search rooms..."
            value={filter.search}
            onChange={(e) => onFilterChange({ ...filter, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
          />
        </div>

        <select
          value={filter.building}
          onChange={(e) => onFilterChange({ ...filter, building: e.target.value })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Buildings</option>
          {BUILDINGS.map((b) => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>

        <select
          value={filter.floor ?? ''}
          onChange={(e) => onFilterChange({ ...filter, floor: e.target.value ? Number(e.target.value) : null })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="">All Floors</option>
          {[1, 2, 3, 4, 5].map((f) => (
            <option key={f} value={f}>Floor {f}</option>
          ))}
        </select>

        <select
          value={filter.status}
          onChange={(e) => onFilterChange({ ...filter, status: e.target.value as RoomFilter['status'] })}
          className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          <option value="all">All Status</option>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
        </select>
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {EQUIPMENT_OPTIONS.map((eq) => (
          <button
            key={eq}
            onClick={() => {
              const newEquipment = filter.equipment.includes(eq)
                ? filter.equipment.filter((e) => e !== eq)
                : [...filter.equipment, eq];
              onFilterChange({ ...filter, equipment: newEquipment });
            }}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
              filter.equipment.includes(eq)
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            {eq}
          </button>
        ))}
      </div>
    </div>
  );
}
