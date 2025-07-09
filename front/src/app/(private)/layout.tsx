import { auth } from '@/lib/auth';
import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
export const metadata: Metadata = {
  title: 'Dashboard | by Jorge Balibrea - @jbalibrea1',
  description: 'Dashboard is a simple tool to manage URLs'
};

import { AppSidebar } from '@/components/app-sidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';

export default async function PrivateLayout({
  children
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect('/login?error=unauthorized');
  }

  return (
    <div className="flex flex-col min-h-svh">
      <main className="flex flex-1 flex-col">
        <SidebarProvider
          style={
            {
              '--sidebar-width': 'calc(var(--spacing) * 72)',
              '--header-height': 'calc(var(--spacing) * 12)'
            } as React.CSSProperties
          }
        >
          <AppSidebar />
          <SidebarInset>{children}</SidebarInset>
        </SidebarProvider>
      </main>
    </div>
  );
}
