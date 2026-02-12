import { AppLayout } from '@/components/atoms/AppLayout';
import Vitals from '@/components/organisms/Vitals';

export function VitalsPage() {
  return (
    <AppLayout
      sidebar={{
        activePage: 'vitals',
      }}
    >
      <div className="h-screen w-full overflow-auto bg-[#FFFFFF]">
        <Vitals />
      </div>
    </AppLayout>
  );
}
