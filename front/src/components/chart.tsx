"use client";

import { usePathname, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useIsMobile } from "@/hooks/use-mobile";
import api from "@/lib/axios";

export const description = "An interactive area chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "var(--primary)",
  },
  mobile: {
    label: "Mobile",
    color: "var(--primary)",
  },
} satisfies ChartConfig;

export function ChartAreaInteractive({ initialDays }: { initialDays: string }) {
  const isMobile = useIsMobile();
  const pathname = usePathname();
  const { data: session } = useSession();
  const [timeRange, setTimeRange] = React.useState(initialDays || "30"); // default to 30
  const [data, setData] = React.useState<{ date: string; clicks: number }[]>(
    [],
  );
  const router = useRouter();
  const createParams = React.useCallback(() => {
    const params = new URLSearchParams();
    params.set("days", timeRange);
    return `${pathname}?${params.toString()}`;
  }, [pathname, timeRange]);

  React.useEffect(() => {
    if (isMobile) {
      setTimeRange("7");
    }
    router.replace(createParams());
  }, [isMobile, createParams, router.replace]);

  React.useEffect(() => {
    async function fetchData() {
      if (!session?.accessToken) return;
      const res = await api.get(`/analytics/by-day?days=${timeRange}`, {
        headers: {
          Authorization: `Bearer ${session.accessToken}`,
        },
      });
      if (res.status !== 200) {
        console.error("Failed to fetch data", res.statusText);
        return;
      }
      const { data } = res.data;
      setData(data);
    }
    fetchData();
  }, [session, timeRange]);

  const totalClicks = data.reduce((acc, item) => acc + item.clicks, 0);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>
          Total of clicks on Short URLs
          <span className="text-muted-foreground">
            {` (${data.length} días, ${totalClicks} clicks)`}
          </span>
        </CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total for the last{" "}
            {timeRange === "90"
              ? "3 months"
              : timeRange === "30"
                ? "30 days"
                : "7 days"}{" "}
            - Last click on{" "}
            {data.length > 0
              ? new Date(data[data.length - 1].date).toLocaleDateString(
                  "en-US",
                  {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  },
                )
              : "N/A"}
          </span>
          <span className="@[540px]/card:hidden">Last {timeRange} days</span>
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
              <SelectItem value="90" className="rounded-lg">
                Last 3 months
              </SelectItem>
              <SelectItem value="30" className="rounded-lg">
                Last 30 days
              </SelectItem>
              <SelectItem value="7" className="rounded-lg">
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
          <AreaChart data={data}>
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
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
            />
            <ChartTooltip
              cursor={false}
              defaultIndex={isMobile ? -1 : 10}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
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
