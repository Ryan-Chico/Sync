import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';
import type { Room } from '@/types';

interface Building3DViewProps {
  rooms: (Room & { hasIssues?: boolean })[];
  floors: number;
  selectedFloor: number;
  onFloorChange: (floor: number) => void;
  onRoomClick: (room: Room) => void;
}

interface FloorProps {
  rooms: (Room & { hasIssues?: boolean })[];
  floor: number;
  isSelected: boolean;
  isBelowSelected: boolean;
  floorY: number;
  onRoomClick: (room: Room) => void;
}

function Room3D({ room, position, size, onClick }: {
  room: Room & { hasIssues?: boolean };
  position: [number, number, number];
  size: [number, number, number];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => {
    if (room.hasIssues) return '#f59e0b'; // yellow for maintenance
    if (room.status === 'occupied') return '#ef4444'; // red for occupied
    return '#22c55e'; // green for available
  }, [room.status, room.hasIssues]);

  const emissiveColor = useMemo(() => {
    if (hovered) return color;
    return '#000000';
  }, [hovered, color]);

  return (
    <group position={position}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={hovered ? color : color}
          emissive={emissiveColor}
          emissiveIntensity={hovered ? 0.3 : 0}
          transparent
          opacity={0.85}
        />
      </mesh>
      {/* Room label */}
      <Text
        position={[0, 0, size[2] / 2 + 0.01]}
        fontSize={0.15}
        color="#ffffff"
        anchorX="center"
        anchorY="middle"
        outlineWidth={0.02}
        outlineColor="#000000"
      >
        {room.room_number}
      </Text>
    </group>
  );
}

function Floor({ rooms, floor, isSelected, isBelowSelected, floorY, onRoomClick }: FloorProps) {
  const floorWidth = 6;
  const floorDepth = 4;
  const floorHeight = 1.5;

  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => a.room_number.localeCompare(b.room_number));
  }, [rooms]);

  const roomLayout = useMemo(() => {
    const count = sortedRooms.length;
    if (count === 0) return { cols: 1, rows: 1 };

    // Arrange rooms in a grid on the floor
    const cols = Math.min(count, 3);
    const rows = Math.ceil(count / cols);
    return { cols, rows };
  }, [sortedRooms]);

  const opacity = isSelected ? 1 : isBelowSelected ? 0.6 : 0.3;

  return (
    <group position={[0, floorY, 0]}>
      {/* Floor slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[floorWidth, 0.1, floorDepth]} />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : '#6b7280'}
          transparent
          opacity={opacity}
          wireframe={!isSelected}
        />
      </mesh>

      {/* Floor outline when selected */}
      {isSelected && (
        <lineSegments position={[0, 0.06, 0]}>
          <edgesGeometry args={[new THREE.BoxGeometry(floorWidth, 0.1, floorDepth)]} />
          <lineBasicMaterial color="#1d4ed8" linewidth={2} />
        </lineSegments>
      )}

      {/* Rooms on this floor */}
      {sortedRooms.map((room, index) => {
        const { cols } = roomLayout;
        const col = index % cols;
        const row = Math.floor(index / cols);

        const roomWidth = (floorWidth - 1) / Math.max(cols, 1) - 0.15;
        const roomDepth = (floorDepth - 1) / Math.max(roomLayout.rows, 1) - 0.15;
        const roomHeight = 0.8;

        const x = -floorWidth / 2 + 0.5 + (col + 0.5) * ((floorWidth - 1) / cols);
        const z = -floorDepth / 2 + 0.5 + (row + 0.5) * ((floorDepth - 1) / roomLayout.rows);
        const y = 0.1 + roomHeight / 2;

        return (
          <Room3D
            key={room.id}
            room={room}
            position={[x, y, z]}
            size={[roomWidth, roomHeight, roomDepth]}
            onClick={() => onRoomClick(room)}
          />
        );
      })}

      {/* Pillars at corners */}
      {[[-1, -1], [-1, 1], [1, -1], [1, 1]].map(([dx, dz], i) => (
        <mesh key={i} position={[dx * floorWidth / 2, floorHeight / 2, dz * floorDepth / 2]}>
          <boxGeometry args={[0.1, floorHeight, 0.1]} />
          <meshStandardMaterial color="#9ca3af" transparent opacity={opacity * 0.8} />
        </mesh>
      ))}
    </group>
  );
}

export function Building3DView({ rooms, floors, selectedFloor, onFloorChange, onRoomClick }: Building3DViewProps) {
  const floorSpacing = 1.8;

  const roomsByFloor = useMemo(() => {
    const map: Record<number, Room[]> = {};
    for (let f = 1; f <= floors; f++) {
      map[f] = rooms.filter((r) => r.floor === f);
    }
    return map;
  }, [rooms, floors]);

  const buildingHeight = floors * floorSpacing;

  return (
    <div className="relative bg-white rounded-xl border border-gray-200 overflow-hidden" style={{ height: '600px' }}>
      <Canvas shadows style={{ width: '100%', height: '100%' }}>
        <PerspectiveCamera makeDefault position={[8, 6, 8]} fov={50} />
        <OrbitControls
          target={[0, buildingHeight / 2, 0]}
          minDistance={5}
          maxDistance={20}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
        />

        {/* Lighting */}
        <ambientLight intensity={0.5} />
        <directionalLight
          position={[10, 15, 10]}
          intensity={1}
          castShadow
          shadow-mapSize-width={2048}
          shadow-mapSize-height={2048}
        />
        <pointLight position={[-5, 10, -5]} intensity={0.3} />

        {/* Ground plane */}
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {/* Building floors - render from bottom to top */}
        {Array.from({ length: floors }, (_, i) => {
          const floor = floors - i; // Render top floor last
          const isSelected = floor === selectedFloor;
          const isBelowSelected = floor < selectedFloor;

          return (
            <Floor
              key={floor}
              rooms={roomsByFloor[floor] || []}
              floor={floor}
              isSelected={isSelected}
              isBelowSelected={isBelowSelected}
              floorY={floor * floorSpacing}
              onRoomClick={onRoomClick}
            />
          );
        })}

        {/* Building frame outlines */}
        {Array.from({ length: floors }, (_, i) => {
          const floor = i + 1;
          const floorY = floor * floorSpacing;
          const isSelected = floor === selectedFloor;

          if (!isSelected) return null;

          return (
            <lineSegments key={`frame-${floor}`} position={[0, floorY + 0.75, 0]}>
              <edgesGeometry args={[new THREE.BoxGeometry(6.2, 1.6, 4.2)]} />
              <lineBasicMaterial color="#1d4ed8" linewidth={2} />
            </lineSegments>
          );
        })}

        {/* Floor number labels */}
        {Array.from({ length: floors }, (_, i) => {
          const floor = i + 1;
          const floorY = floor * floorSpacing;
          const isSelected = floor === selectedFloor;

          return (
            <Text
              key={`label-${floor}`}
              position={[-3.8, floorY + 0.75, 0]}
              fontSize={0.3}
              color={isSelected ? '#1d4ed8' : '#6b7280'}
              anchorX="center"
              anchorY="middle"
              rotation={[0, 0, 0]}
            >
              {`F${floor}`}
            </Text>
          );
        })}
      </Canvas>

      {/* Floor selector overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 bg-white/95 backdrop-blur-sm rounded-xl px-4 py-3 shadow-lg border border-gray-200">
        {Array.from({ length: floors }, (_, i) => {
          const floor = floors - i;
          const roomCount = (roomsByFloor[floor] || []).length;
          const isSelected = floor === selectedFloor;

          return (
            <button
              key={floor}
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onFloorChange(floor);
              }}
              className={`flex flex-col items-center px-4 py-2 rounded-lg text-sm font-medium transition-all min-w-[70px] ${
                isSelected
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <span className="font-semibold">F{floor}</span>
              {roomCount > 0 && (
                <span className={`text-xs mt-0.5 ${isSelected ? 'text-blue-200' : 'text-gray-500'}`}>
                  {roomCount} rooms
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
