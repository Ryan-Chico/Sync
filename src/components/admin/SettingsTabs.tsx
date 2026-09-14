import { useState } from 'react';
import { Users, Building2, Wrench, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserTable } from './UserTable';
import { BuildingTable } from './BuildingTable';
import { EquipmentTable } from './EquipmentTable';
import { GeneralSettings } from './GeneralSettings';

type Tab = 'users' | 'buildings' | 'equipment' | 'general';

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: 'users', label: 'Users', icon: Users },
  { id: 'buildings', label: 'Buildings', icon: Building2 },
  { id: 'equipment', label: 'Equipment', icon: Wrench },
  { id: 'general', label: 'General', icon: Settings },
];

export function SettingsTabs() {
  const [activeTab, setActiveTab] = useState<Tab>('users');

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="flex gap-1 -mb-px">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                <Icon className="w-4 h-4" />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'users' && <UserTable />}
      {activeTab === 'buildings' && <BuildingTable />}
      {activeTab === 'equipment' && <EquipmentTable />}
      {activeTab === 'general' && <GeneralSettings />}
    </div>
  );
}
