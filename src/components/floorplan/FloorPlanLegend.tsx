export function FloorPlanLegend() {
  return (
    <div className="flex flex-wrap gap-4 text-sm">
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-green-100 border-2 border-green-400 rounded" />
        <span className="text-gray-600">Available</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-red-100 border-2 border-red-400 rounded" />
        <span className="text-gray-600">Occupied</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-4 h-4 bg-yellow-100 border-2 border-yellow-400 rounded" />
        <span className="text-gray-600">Issues</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-yellow-600">⚠</span>
        <span className="text-gray-600">Has Issues</span>
      </div>
    </div>
  );
}
