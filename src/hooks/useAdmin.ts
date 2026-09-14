import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Profile, Building, Equipment, AppSetting } from '@/types';

// ============================================
// USERS HOOK
// ============================================
export function useUsers() {
  const [users, setUsers] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) console.error('Error fetching users:', error);
    else setUsers((data as Profile[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  async function updateUserRole(userId: string, role: 'admin' | 'staff') {
    const { error } = await supabase
      .from('profiles')
      .update({ role, updated_at: new Date().toISOString() })
      .eq('id', userId);

    if (error) throw error;
    fetchUsers();
  }

  return { users, loading, updateUserRole, refetch: fetchUsers };
}

// ============================================
// BUILDINGS HOOK
// ============================================
export function useBuildings() {
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBuildings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('buildings')
      .select('*')
      .order('name');

    if (error) console.error('Error fetching buildings:', error);
    else setBuildings((data as Building[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchBuildings();
  }, [fetchBuildings]);

  async function createBuilding(building: Omit<Building, 'id' | 'created_at'>) {
    const { error } = await supabase.from('buildings').insert(building);
    if (error) throw error;
    fetchBuildings();
  }

  async function updateBuilding(id: string, updates: Partial<Building>) {
    const { error } = await supabase.from('buildings').update(updates).eq('id', id);
    if (error) throw error;
    fetchBuildings();
  }

  async function deleteBuilding(id: string) {
    const { error } = await supabase.from('buildings').delete().eq('id', id);
    if (error) throw error;
    fetchBuildings();
  }

  return { buildings, loading, createBuilding, updateBuilding, deleteBuilding, refetch: fetchBuildings };
}

// ============================================
// EQUIPMENT HOOK
// ============================================
export function useEquipment() {
  const [equipment, setEquipment] = useState<Equipment[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEquipment = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('equipment')
      .select('*')
      .order('name');

    if (error) console.error('Error fetching equipment:', error);
    else setEquipment((data as Equipment[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchEquipment();
  }, [fetchEquipment]);

  async function createEquipment(equip: Omit<Equipment, 'id' | 'created_at'>) {
    const { error } = await supabase.from('equipment').insert(equip);
    if (error) throw error;
    fetchEquipment();
  }

  async function updateEquipment(id: string, updates: Partial<Equipment>) {
    const { error } = await supabase.from('equipment').update(updates).eq('id', id);
    if (error) throw error;
    fetchEquipment();
  }

  async function deleteEquipment(id: string) {
    const { error } = await supabase.from('equipment').delete().eq('id', id);
    if (error) throw error;
    fetchEquipment();
  }

  return { equipment, loading, createEquipment, updateEquipment, deleteEquipment, refetch: fetchEquipment };
}

// ============================================
// APP SETTINGS HOOK
// ============================================
export function useAppSettings() {
  const [settings, setSettings] = useState<AppSetting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('app_settings')
      .select('*')
      .order('key');

    if (error) console.error('Error fetching settings:', error);
    else setSettings((data as AppSetting[]) || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  async function updateSetting(key: string, value: string) {
    const { error } = await supabase
      .from('app_settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);

    if (error) throw error;
    fetchSettings();
  }

  function getSetting(key: string): string | undefined {
    return settings.find((s) => s.key === key)?.value;
  }

  return { settings, loading, updateSetting, getSetting, refetch: fetchSettings };
}
