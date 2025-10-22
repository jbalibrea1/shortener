import type { Metadata } from 'next';

import Footer from '@/components/layout/main/footer';
import HeaderNavigation from '@/components/layout/main/header-navigation';

export const metadata: Metadata = {
  title: 'APP URL Shortener | by Jorge Balibrea - @jbalibrea1',
  description: 'URL Shortener is a simple tool to shorten URLs',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-svh">
      <HeaderNavigation />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
