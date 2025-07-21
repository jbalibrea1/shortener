"use client";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { OverlayLoading } from "@/components/overlay-loading";

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);
  // TODO: DELETE?
  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => setLoading(false), 200);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? <OverlayLoading /> : null;
}

export default RouteLoadingOverlay;
