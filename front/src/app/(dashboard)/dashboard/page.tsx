import { ChartAreaInteractive } from '@/components/chart';
import { SectionCards } from '@/components/sections-cards';
import { SiteHeader } from '@/components/site-header';
import { ChartSkeleton } from '@/components/skeletons';
import { Suspense } from 'react';

export default function DashboardPage() {
  return (
    <>
      <SiteHeader site="Dashboard" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            <SectionCards>
              <div className="px-4 lg:px-6">
                <Suspense fallback={<ChartSkeleton />}>
                  <ChartAreaInteractive />
                </Suspense>
                {/* Placeholder for analytics content */}
              </div>
            </SectionCards>
            <div className="px-4 lg:px-6"></div>
          </div>
        </div>
      </div>
    </>
  );
}
