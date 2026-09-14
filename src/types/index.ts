export interface Profile {
  id: string;
  full_name: string;
  role: 'admin' | 'staff';
  department: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
}

export interface Room {
  id: string;
  room_number: string;
  name: string;
  description: string | null;
  capacity: number;
  floor: number;
  building: string;
  equipment: string[];
  image_url: string | null;
  is_active: boolean;
  floor_plan_x: number;
  floor_plan_y: number;
  floor_plan_width: number;
  floor_plan_height: number;
  created_at: string;
  updated_at: string;
  current_booking?: Booking | null;
  status?: 'available' | 'occupied' | 'maintenance';
}

export interface Booking {
  id: string;
  room_id: string;
  user_id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  status: 'confirmed' | 'cancelled' | 'completed';
  created_at: string;
  room?: Room;
  user?: Profile;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  read: boolean;
  link: string | null;
  created_at: string;
}

export interface RoomFilter {
  search: string;
  building: string;
  floor: number | null;
  capacity: number | null;
  equipment: string[];
  status: 'all' | 'available' | 'occupied';
}

export interface Building {
  id: string;
  name: string;
  floors: number;
  is_active: boolean;
  created_at: string;
}

export interface Equipment {
  id: string;
  name: string;
  is_active: boolean;
  created_at: string;
}

export interface AppSetting {
  id: string;
  key: string;
  value: string;
  description: string | null;
  updated_at: string;
}

export interface RoomIssue {
  id: string;
  room_id: string;
  reported_by: string;
  equipment_name: string;
  description: string | null;
  status: 'reported' | 'verified' | 'fixed';
  verified_by: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  room?: Room;
  reporter?: Profile;
  verifier?: Profile;
}

export const BUILDINGS = ['Main Building', 'Science Building', 'Admin Building', 'Library'] as const;
export const EQUIPMENT_OPTIONS = ['computers', 'projector', 'whiteboard', 'microphone', 'conference_phone'] as const;
