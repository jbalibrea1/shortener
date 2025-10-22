import { auth } from '@/auth';
import { SiteHeader } from '@/components/layout/site-header';
import api from '@/lib/axios';
import { columns, type ShortUrlAnalytics } from './columns';
import { DataTable } from './data-table';

async function fetchStats(): Promise<ShortUrlAnalytics[]> {
  const session = await auth();
  const token = session?.accessToken;
  const res = await api.get('/analytics/user/urls', {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (res.status !== 200) throw new Error('Failed to fetch stats');
  const { data } = res.data;
  return data;
}

export default async function AnalyticsPage() {
  const data = await fetchStats();
  return (
    <>
      <SiteHeader site="Analytics" />
      <div className="flex flex-1 flex-col">
        <div className="@container/main flex flex-1 flex-col gap-2">
          <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
            {/* Add your analytics components here */}
            <div className="container mx-auto py-10">
              <DataTable columns={columns} data={data} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
