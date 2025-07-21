import { SiteHeader } from "@/components/site-header";
import { DashboardSkeleton } from "@/components/skeletons";

export default function Loading() {
  return (
    <>
      <SiteHeader site="Dashboard" />
      <DashboardSkeleton />
    </>
  );
}
