'use client';

import { SessionProvider } from 'next-auth/react';
import RouteLoadingOverlay from './main/routeLoading';
import { ThemeProvider } from './theme-provider';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        {children}
      </ThemeProvider>
      <RouteLoadingOverlay />
    </SessionProvider>
  );
}

export default ClientProviders;
