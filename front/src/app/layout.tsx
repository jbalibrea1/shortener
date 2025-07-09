import '@/styles/globals.css';
import type { Metadata } from 'next';

import ClientProviders from '@/components/client-provider';
import { fontSans, roboto } from '@/components/fonts';
import { Toaster } from '@/components/ui/sonner';
import { cn } from '@/lib/utils';

export const metadata: Metadata = {
  title: 'URL Shortener | by Jorge Balibrea - @jbalibrea1',
  description: 'URL Shortener is a simple tool to shorten URLs'
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={cn(
          roboto.className,
          fontSans.className,
          'font-sans min-h-svh bg-background antialiased'
        )}
        suppressHydrationWarning
      >
        <ClientProviders>{children}</ClientProviders>
        <Toaster position="top-center" />
      </body>
    </html>
  );
}
