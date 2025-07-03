import '@/app/globals.css';
import ClientProviders from '@/components/ClientProviders';
import { fontSans } from '@/components/fonts';
import Footer from '@/components/footer';
import Navigation from '@/components/Navigation';
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
          `font-sans min-h-svh bg-background antialiased`,
          fontSans.variable
        )}
        suppressHydrationWarning
      >
        <ClientProviders>
          <div className="flex flex-col  min-h-svh">
            <Navigation />
            {/* <main className="container max-w-screen-md mx-auto w-full h-full flex-1 flex flex-col"> */}
            <main className="flex flex-1 flex-col">{children}</main>
            <Footer />
          </div>
        </ClientProviders>
      </body>
    </html>
  );
}
