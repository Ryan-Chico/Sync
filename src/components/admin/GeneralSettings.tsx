import { useState, useEffect } from 'react';
import { Save } from 'lucide-react';
import { useAppSettings } from '@/hooks/useAdmin';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Spinner } from '@/components/ui/Spinner';

export function GeneralSettings() {
  const { settings, loading, updateSetting } = useAppSettings();
  const [values, setValues] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (settings.length > 0) {
      const map: Record<string, string> = {};
      settings.forEach((s) => { map[s.key] = s.value; });
      setValues(map);
    }
  }, [settings]);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      for (const [key, value] of Object.entries(values)) {
        await updateSetting(key, value);
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      console.error('Failed to save settings:', err);
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <Spinner />;

  const settingsConfig = settings.map((s) => ({
    ...s,
    label: s.key
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
  }));

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Configure application defaults</p>
        <Button onClick={handleSave} disabled={saving} size="sm">
          <Save className="w-4 h-4 mr-1" />
          {saving ? 'Saving...' : saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <div className="space-y-6 max-w-md">
          {settingsConfig.map((setting) => (
            <Input
              key={setting.key}
              label={setting.label}
              value={values[setting.key] || ''}
              onChange={(e) => setValues({ ...values, [setting.key]: e.target.value })}
              placeholder={setting.description || ''}
            />
          ))}
        </div>

        {settingsConfig.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No settings found. Run the SQL schema to add default settings.
          </div>
        )}
      </div>

      <div className="mt-4 bg-blue-50 rounded-lg p-4 text-sm text-blue-800">
        <p className="font-medium">Settings Key Reference</p>
        <ul className="mt-2 space-y-1 list-disc list-inside text-blue-700">
          <li><strong>default_capacity</strong> — Default room capacity for new rooms</li>
          <li><strong>default_floor</strong> — Default floor for new rooms</li>
          <li><strong>max_booking_days</strong> — How many days ahead users can book</li>
          <li><strong>booking_duration_limit</strong> — Max booking duration in hours</li>
        </ul>
      </div>
    </div>
  );
}
