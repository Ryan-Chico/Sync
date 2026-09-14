import { cn } from '@/lib/utils';

interface FloorSelectorProps {
  buildings: { name: string; floors: number }[];
  selectedBuilding: string;
  onBuildingChange: (building: string) => void;
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
  floorCount: number;
}

export function FloorSelector({
  buildings,
  selectedBuilding,
  onBuildingChange,
  selectedFloor,
  onFloorChange,
  floorCount,
}: FloorSelectorProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4">
      {/* Building Selector */}
      <div className="flex-1">
        <label className="block text-sm font-medium text-gray-700 mb-1">Building</label>
        <select
          value={selectedBuilding}
          onChange={(e) => onBuildingChange(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm"
        >
          {buildings.map((b) => (
            <option key={b.name} value={b.name}>{b.name}</option>
          ))}
        </select>
      </div>

      {/* Floor Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Floor</label>
        <div className="flex gap-1">
          {Array.from({ length: floorCount }, (_, i) => i + 1).map((floor) => (
            <button
              key={floor}
              onClick={() => onFloorChange(floor)}
              className={cn(
                'w-10 h-10 rounded-lg text-sm font-medium transition-colors',
                selectedFloor === floor
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {floor}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
