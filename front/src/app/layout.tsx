import '@/app/globals.css';
import ClientProviders from '@/components/client-provider';
import { fontSans, roboto } from '@/components/fonts';
import Footer from '@/components/footer';
import HeaderNavigation from '@/components/header-navigation';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

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
          `font-sans min-h-svh bg-background antialiased`
        )}
        suppressHydrationWarning
      >
        <ClientProviders>
          <div className="flex flex-col  min-h-svh">
            <HeaderNavigation />
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
            <Toaster />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
