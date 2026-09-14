import { useState, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, PerspectiveCamera, Billboard } from '@react-three/drei';
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

const MAIN_WING = { width: 6, depth: 4 };
const SIDE_WING = { width: 2.5, depth: 3 };
const FLOOR_HEIGHT = 0.1;
const ROOM_HEIGHT = 0.8;
const PILLAR_SIZE = 0.12;

// Positions for main wing (centered at origin)
const MAIN = {
  left: -MAIN_WING.width / 2,
  right: MAIN_WING.width / 2,
  front: -MAIN_WING.depth / 2,
  back: MAIN_WING.depth / 2,
};

// Positions for side wing (attached to left-back of main wing)
const SIDE = {
  left: -MAIN_WING.width / 2 - SIDE_WING.width / 2,
  right: -MAIN_WING.width / 2 + SIDE_WING.width / 2,
  front: MAIN_WING.depth / 2,
  back: MAIN_WING.depth / 2 + SIDE_WING.depth,
};

function Room3D({ room, position, size, onClick }: {
  room: Room & { hasIssues?: boolean };
  position: [number, number, number];
  size: [number, number, number];
  onClick: () => void;
}) {
  const [hovered, setHovered] = useState(false);

  const color = useMemo(() => {
    if (room.hasIssues) return '#f59e0b';
    if (room.status === 'occupied') return '#ef4444';
    return '#22c55e';
  }, [room.status, room.hasIssues]);

  return (
    <group position={position}>
      <mesh
        onClick={(e) => { e.stopPropagation(); onClick(); }}
        onPointerEnter={(e) => { e.stopPropagation(); setHovered(true); document.body.style.cursor = 'pointer'; }}
        onPointerLeave={() => { setHovered(false); document.body.style.cursor = 'default'; }}
      >
        <boxGeometry args={size} />
        <meshStandardMaterial
          color={color}
          emissive={hovered ? color : '#000000'}
          emissiveIntensity={hovered ? 0.3 : 0}
          transparent
          opacity={0.85}
        />
      </mesh>
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
  const sortedRooms = useMemo(() => {
    return [...rooms].sort((a, b) => a.room_number.localeCompare(b.room_number));
  }, [rooms]);

  const mainWingRooms = useMemo(() => {
    const halfIndex = Math.ceil(sortedRooms.length * 0.6);
    return sortedRooms.slice(0, halfIndex);
  }, [sortedRooms]);

  const sideWingRooms = useMemo(() => {
    const halfIndex = Math.ceil(sortedRooms.length * 0.6);
    return sortedRooms.slice(halfIndex);
  }, [sortedRooms]);

  const opacity = isSelected ? 1 : isBelowSelected ? 0.6 : 0.3;

  const mainLayout = useMemo(() => {
    const count = mainWingRooms.length;
    if (count === 0) return { cols: 1, rows: 1 };
    const cols = Math.min(count, 3);
    const rows = Math.ceil(count / cols);
    return { cols, rows };
  }, [mainWingRooms]);

  const sideLayout = useMemo(() => {
    const count = sideWingRooms.length;
    if (count === 0) return { cols: 1, rows: 1 };
    return { cols: 1, rows: Math.ceil(count) };
  }, [sideWingRooms]);

  return (
    <group position={[0, floorY, 0]}>
      {/* Main wing floor slab */}
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[MAIN_WING.width, FLOOR_HEIGHT, MAIN_WING.depth]} />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : '#6b7280'}
          transparent
          opacity={opacity}
          wireframe={!isSelected}
        />
      </mesh>

      {/* Side wing floor slab */}
      <mesh position={[(SIDE.left + SIDE.right) / 2, 0, (SIDE.front + SIDE.back) / 2]}>
        <boxGeometry args={[SIDE_WING.width, FLOOR_HEIGHT, SIDE_WING.depth]} />
        <meshStandardMaterial
          color={isSelected ? '#3b82f6' : '#6b7280'}
          transparent
          opacity={opacity}
          wireframe={!isSelected}
        />
      </mesh>

      {/* Rooms in main wing */}
      {mainWingRooms.map((room, index) => {
        const { cols } = mainLayout;
        const col = index % cols;
        const row = Math.floor(index / cols);

        const roomWidth = (MAIN_WING.width - 1) / Math.max(cols, 1) - 0.15;
        const roomDepth = (MAIN_WING.depth - 1) / Math.max(mainLayout.rows, 1) - 0.15;

        const x = -MAIN_WING.width / 2 + 0.5 + (col + 0.5) * ((MAIN_WING.width - 1) / cols);
        const z = -MAIN_WING.depth / 2 + 0.5 + (row + 0.5) * ((MAIN_WING.depth - 1) / mainLayout.rows);
        const y = FLOOR_HEIGHT / 2 + ROOM_HEIGHT / 2;

        return (
          <Room3D
            key={room.id}
            room={room}
            position={[x, y, z]}
            size={[roomWidth, ROOM_HEIGHT, roomDepth]}
            onClick={() => onRoomClick(room)}
          />
        );
      })}

      {/* Rooms in side wing */}
      {sideWingRooms.map((room, index) => {
        const row = index;

        const roomWidth = SIDE_WING.width - 0.5;
        const roomDepth = (SIDE_WING.depth - 0.5) / Math.max(sideLayout.rows, 1) - 0.1;

        const x = (SIDE.left + SIDE.right) / 2;
        const z = SIDE.front + 0.25 + (row + 0.5) * ((SIDE_WING.depth - 0.5) / sideLayout.rows);
        const y = FLOOR_HEIGHT / 2 + ROOM_HEIGHT / 2;

        return (
          <Room3D
            key={room.id}
            room={room}
            position={[x, y, z]}
            size={[roomWidth, ROOM_HEIGHT, roomDepth]}
            onClick={() => onRoomClick(room)}
          />
        );
      })}

      {/* Pillars at all corners */}
      {[
        // Main wing corners
        [MAIN.left, MAIN.front],
        [MAIN.right, MAIN.front],
        [MAIN.right, MAIN.back],
        // Side wing corners
        [SIDE.left, SIDE.front],
        [SIDE.left, SIDE.back],
        [SIDE.right, SIDE.back],
      ].map(([x, z], i) => (
        <mesh key={`pillar-${i}`} position={[x, 0.75 + FLOOR_HEIGHT / 2, z]}>
          <boxGeometry args={[PILLAR_SIZE, 1.5, PILLAR_SIZE]} />
          <meshStandardMaterial color="#4b5563" transparent opacity={0.9} />
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
        <PerspectiveCamera makeDefault position={[12, 8, 12]} fov={40} />
        <OrbitControls
          target={[0, buildingHeight / 2, 1.5]}
          minDistance={5}
          maxDistance={30}
          enablePan={true}
          enableZoom={true}
          enableRotate={true}
          maxPolarAngle={Math.PI / 2.1}
        />

        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 15, 10]} intensity={1} castShadow shadow-mapSize-width={2048} shadow-mapSize-height={2048} />
        <pointLight position={[-5, 10, -5]} intensity={0.3} />

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
          <planeGeometry args={[30, 30]} />
          <meshStandardMaterial color="#1f2937" />
        </mesh>

        {Array.from({ length: floors }, (_, i) => {
          const floor = floors - i;
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

        {/* Building outline for selected floor */}
        {(() => {
          const floorY = selectedFloor * floorSpacing;
          const outlineHeight = 1.6;

          // Create L-shape outline points
          const points = [
            new THREE.Vector3(MAIN.left, floorY + outlineHeight / 2, MAIN.front),
            new THREE.Vector3(MAIN.right, floorY + outlineHeight / 2, MAIN.front),
            new THREE.Vector3(MAIN.right, floorY + outlineHeight / 2, MAIN.back),
            new THREE.Vector3(SIDE.right, floorY + outlineHeight / 2, SIDE.front),
            new THREE.Vector3(SIDE.right, floorY + outlineHeight / 2, SIDE.back),
            new THREE.Vector3(SIDE.left, floorY + outlineHeight / 2, SIDE.back),
            new THREE.Vector3(SIDE.left, floorY + outlineHeight / 2, SIDE.front),
            new THREE.Vector3(MAIN.left, floorY + outlineHeight / 2, MAIN.front),
          ];

          const geometry = new THREE.BufferGeometry().setFromPoints(points);

          return (
            <lineLoop geometry={geometry}>
              <lineBasicMaterial color="#1d4ed8" linewidth={2} />
            </lineLoop>
          );
        })()}

        {/* Floor number labels */}
        {Array.from({ length: floors }, (_, i) => {
          const floor = i + 1;
          const floorY = floor * floorSpacing;
          const isSelected = floor === selectedFloor;

          return (
            <Billboard
              key={`label-${floor}`}
              position={[MAIN.left - 1, floorY + 0.75, 0]}
            >
              <Text
                fontSize={0.3}
                color={isSelected ? '#1d4ed8' : '#6b7280'}
                anchorX="center"
                anchorY="middle"
              >
                {`F${floor}`}
              </Text>
            </Billboard>
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
