import { useState } from 'react';
import { AppLayout } from '@/components/atoms/AppLayout';
import { Button } from '@/components/atoms/Button';
import { PanelLeft } from 'lucide-react';
import Vitals from '@/components/organisms/Vitals';

export function VitalsPage() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <AppLayout
      sidebar={{
        activePage: 'vitals',
        isCollapsed: sidebarCollapsed,
      }}
    >
      <div className="flex flex-col h-screen w-full bg-[#FFFFFF]">
        <div className="h-[52px] flex-shrink-0 flex items-center px-6 border-b gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="!h-8 !w-8 flex-shrink-0"
            onClick={() => setSidebarCollapsed((v) => !v)}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-auto">
          <Vitals />
        </div>
      </div>
    </AppLayout>
  );
}
