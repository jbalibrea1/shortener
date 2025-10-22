import { Suspense } from 'react';
import { auth } from '@/auth';
import { ChartAreaInteractive } from '@/components/charts/chart';
import { SectionCards } from '@/components/common/sections-cards';
import { ChartSkeleton } from '@/components/common/skeletons';
import { SiteHeader } from '@/components/layout/site-header';
import api from '@/lib/axios';

async function fetchStats() {
  const session = await auth();
  const token = session?.accessToken;
  const res = await api.get('/analytics/user/global-metrics', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error('Failed to fetch stats');
  const { data } = res.data;
  return data;
}

export default async function DashboardPage(props: {
  searchParams?: Promise<{
    days?: string;
  }>;
}) {
  const data = await fetchStats();
  const searchParams = await props.searchParams;
  const days = searchParams?.days || '30';
  return (
    <>
      <SiteHeader site="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards data={data} variant="main" />
            <div className="px-4 lg:px-6">
              <Suspense fallback={<ChartSkeleton />}>
                <ChartAreaInteractive initialDays={days} />
              </Suspense>
            </div>
            <SectionCards data={data} variant="secondary" />
          </div>
        </div>
      </div>
    </>
  );
}
