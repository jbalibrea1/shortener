import '@/app/globals.css';
import { fontSans } from '@/components/fonts';
import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';
import { cn } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'URL Shortener | by Jorge Balibrea - @jbalibrea1',
  description: 'URL Shortener is a simple tool to shorten URLs',
};

export default function RootLayout({
  children,
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
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="relative flex min-h-svh flex-col ">{children}</div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
