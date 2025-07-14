'use client';

import { useSession } from 'next-auth/react';
import * as React from 'react';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useIsMobile } from '@/hooks/use-mobile';

export const description = 'An interactive area chart';

const chartData = [
  { date: '2025-05-22', clicks: 49 },
  { date: '2025-07-02', clicks: 14 },
  { date: '2025-07-05', clicks: 12 },
  { date: '2025-07-06', clicks: 11 }
];

const chartConfig = {
  visitors: {
    label: 'Visitors'
  },
  desktop: {
    label: 'Desktop',
    color: 'var(--primary)'
  },
  mobile: {
    label: 'Mobile',
    color: 'var(--primary)'
  }
} satisfies ChartConfig;

export function ChartAreaInteractive() {
  const isMobile = useIsMobile();
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = React.useState('90d');
  const [data, setData] = React.useState<{ date: string; clicks: number }[]>(
    []
  );

  // TODO: Remove loading?
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange('7d');
    }
  }, [isMobile]);

  React.useEffect(() => {
    if (!session?.accessToken) return;
    setLoading(true);
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/analytics/by-day`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, [session]);

  const filteredData = data.filter((item) => {
    const date = new Date(item.date);
    const referenceDate = new Date();
    let daysToSubtract = 90;
    if (timeRange === '30d') {
      daysToSubtract = 30;
    } else if (timeRange === '7d') {
      daysToSubtract = 7;
    }
    const startDate = new Date(referenceDate);
    startDate.setDate(startDate.getDate() - daysToSubtract);
    return date >= startDate;
  });

  const totalClicks = filteredData.reduce((acc, item) => acc + item.clicks, 0);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          Total of clicks on Short URLs
          <span className="text-muted-foreground">
            {' '}
            ({filteredData.length} días, {totalClicks} clicks)
          </span>
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last{' '}
            {timeRange === '90d'
              ? '3 months'
              : timeRange === '30d'
              ? '30 days'
              : '7 days'}{' '}
            - Last click on{' '}
            {filteredData.length > 0
              ? new Date(
                  filteredData[filteredData.length - 1].date
                ).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric'
                })
              : 'N/A'}
          </span>
          <span className="@[540px]/card:hidden">Last 3 months</span>
        </CardDescription>
        <CardAction>
          <Select value={timeRange} onValueChange={setTimeRange}>
            <SelectTrigger
              className="hidden w-[160px] rounded-lg sm:ml-auto sm:flex"
              aria-label="Select a value"
            >
              <SelectValue placeholder="Last 3 months" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="90d" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30d" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7d" className="rounded-lg">
                Last 7 days
              </SelectItem>
            </SelectContent>
          </Select>
        </CardAction>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[250px] w-full"
        >
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillClicks" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={1.0}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric'
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric'
                    });
                  }}
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="clicks"
              type="natural"
              fill="url(#fillClicks)"
              stroke="var(--color-desktop)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
