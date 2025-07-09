'use client';
import { OverlayLoading } from '@/components/overlay-loading';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export function RouteLoadingOverlay() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);

    const timeout = setTimeout(() => setLoading(false), 200);

    return () => clearTimeout(timeout);
  }, [pathname]);

  return loading ? <OverlayLoading /> : null;
}

export default RouteLoadingOverlay;
