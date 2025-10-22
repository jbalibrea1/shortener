import { DashboardSkeleton } from '@/components/common/skeletons';
import { SiteHeader } from '@/components/layout/site-header';

export default function Loading() {
  return (
    <>
      <SiteHeader site="Dashboard" />
      <DashboardSkeleton />
    </>
  );
}
