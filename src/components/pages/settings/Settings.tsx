import { useState } from 'react';
import { AppLayout } from '@/components/atoms/AppLayout';
import { Button } from '@/components/atoms/Button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/molecules/PageTabs';
import { PanelLeft } from 'lucide-react';

const TABS = ['billing', 'calendar', 'vitals', 'logs', 'contacts', 'communications', 'webhooks', 'admin'] as const;
type Tab = typeof TABS[number];

const TAB_META: Record<Tab, { title: string; description: string }> = {
  billing: { title: 'Billing', description: '' },
  calendar: { title: 'Calendar', description: 'Organization calendar settings' },
  vitals: { title: 'Vitals', description: 'Vitals monitoring configuration' },
  logs: { title: 'Logs', description: '' },
  contacts: { title: 'Contacts', description: '' },
  communications: { title: 'Communications', description: '' },
  webhooks: { title: 'Webhooks', description: '' },
  admin: { title: 'Admin', description: '' },
};

export function Settings() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('calendar');

  const meta = TAB_META[activeTab];

  return (
    <AppLayout sidebar={{ isCollapsed: sidebarCollapsed, defaultMessagingExpanded: false, defaultSettingsExpanded: true, activeSettingsItem: 'Organizations' }}>
      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as Tab)} className="flex flex-col">
        {/* Header bar */}
        <div className="h-[52px] flex items-center px-6 border-b gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="!h-8 !w-8 flex-shrink-0"
            onClick={() => setSidebarCollapsed((v) => !v)}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
          <TabsList className="h-full">
            {TABS.map((tab) => (
              <TabsTrigger key={tab} value={tab} className="capitalize">{tab}</TabsTrigger>
            ))}
          </TabsList>
        </div>

        {/* Page header */}
        <div className="h-[116px] border-b flex-shrink-0 flex items-center justify-between px-6">
          <div className="flex flex-col gap-2">
            <span style={{ fontSize: '30px', lineHeight: '36px', color: '#0A0A0A', fontWeight: 600 }}>
              {meta.title}
            </span>
            {meta.description && (
              <span style={{ fontSize: '16px', lineHeight: '24px', color: '#737373' }}>
                {meta.description}
              </span>
            )}
          </div>
          <Button variant="outline" className="!h-9">Contact support</Button>
        </div>

        {/* Tab content */}
        {TABS.map((tab) => (
          <TabsContent key={tab} value={tab} className="mt-0" />
        ))}
      </Tabs>
    </AppLayout>
  );
}
