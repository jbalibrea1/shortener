import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

function renderTopList(
  items: { name: string; count: number }[],
  label = "No data",
) {
  const total = items.reduce(
    (acc: number, c: { count: number }) => acc + (c?.count || 0),
    0,
  );
  return [0, 1, 2].map((i) => {
    const item = items[i];
    const percent =
      item && total > 0 ? Math.round((item.count / total) * 100) : 0;
    return item ? (
      <div key={item.name} className="flex items-center justify-between">
        <span>{item.name}</span>
        <span className="text-muted-foreground">
          {item.count.toLocaleString()}{" "}
          <span className="ml-1 text-xs">({percent}%)</span>
        </span>
      </div>
    ) : (
      <div
        key={i}
        className="flex items-center justify-between opacity-60 italic"
      >
        <span>{label}</span>
        <span>—</span>
      </div>
    );
  });
}

interface SectionCardsProps {
  data: any;
  variant: "main" | "secondary";
}

export function SectionCards({ data, variant }: SectionCardsProps) {
  // Helper para mostrar valores seguros
  const safeNumber = (value: number | undefined | null) =>
    typeof value === "number" && !Number.isNaN(value)
      ? value.toLocaleString()
      : "—";

  const safeTrend = (value: number | undefined | null) =>
    typeof value === "number" && !Number.isNaN(value) ? value.toFixed(1) : "—";

  if (variant === "main") {
    return (
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 ">
        {/* Total Clicks */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total of Clicks</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {safeNumber(data?.totalClicks)}
            </CardTitle>
            <CardAction>
              <Badge variant={data?.trend >= 0 ? "outline" : "destructive"}>
                {data?.trend >= 0 ? <IconTrendingUp /> : <IconTrendingDown />}
                {data?.trend >= 0 && typeof data?.trend === "number" ? "+" : ""}
                {safeTrend(data?.trend)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {typeof data?.trend === "number"
                ? data.trend >= 0
                  ? "Trending up"
                  : "Trending down"
                : "No data"}{" "}
              this week{" "}
              {typeof data?.trend === "number" ? (
                data.trend >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )
              ) : null}
            </div>
            <div className="text-muted-foreground">
              {`Week avg: ${safeNumber(
                data?.weekAvgClicks,
              )} | Monthly avg: ${safeNumber(data?.monthAvgClicks)}`}
            </div>
          </CardFooter>
        </Card>
        {/* Total Short URLs */}
        <Card className="@container/card">
          <CardHeader>
            <CardDescription>Total of short URL's</CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {safeNumber(data?.totalShortUrls)}
            </CardTitle>
            <CardAction>
              <Badge
                variant={data?.trendShortUrls >= 0 ? "outline" : "destructive"}
              >
                {data?.trendShortUrls >= 0 ? (
                  <IconTrendingUp />
                ) : (
                  <IconTrendingDown />
                )}
                {data?.trendShortUrls >= 0 &&
                typeof data?.trendShortUrls === "number"
                  ? "+"
                  : ""}
                {safeNumber(data?.trendShortUrls)}%
              </Badge>
            </CardAction>
          </CardHeader>
          <CardFooter className="flex-col items-start gap-1.5 text-sm">
            <div className="line-clamp-1 flex gap-2 font-medium">
              {typeof data?.trendShortUrls === "number"
                ? data.trendShortUrls >= 0
                  ? "Trending up"
                  : "Trending down"
                : "No data"}{" "}
              this week{" "}
              {typeof data?.trendShortUrls === "number" ? (
                data.trendShortUrls >= 0 ? (
                  <IconTrendingUp className="size-4" />
                ) : (
                  <IconTrendingDown className="size-4" />
                )
              ) : null}
            </div>
            <div className="text-muted-foreground">
              {`Week total: ${safeNumber(
                data?.weekShortUrls,
              )} | Monthly avg: ${safeNumber(data?.monthAvgShortUrls)}`}
            </div>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Secondary cards (6)
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card dark:*:data-[slot=card]:bg-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-gradient-to-t *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-3">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            Top 3 countries with the most visitors.
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Countries
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {renderTopList(data?.topCountries ?? [])}
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top 3 device types used</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Device Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {renderTopList(data?.topDeviceTypes ?? [])}
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top 3 cities by number of visitors.</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Cities
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {renderTopList(data?.topCities ?? [])}
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top 3 browsers used</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Browsers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {renderTopList(data?.topBrowsers ?? [])}
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top 3 operating systems used</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Operating Systems
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {renderTopList(data?.topOperatingSystems ?? [])}
          </div>
        </CardContent>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>
            Top 3 referrers by number of visits.
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            Referrers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-2">
            {renderTopList(data?.topReferrers ?? [])}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
