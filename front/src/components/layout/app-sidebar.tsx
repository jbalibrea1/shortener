'use client';

import {
  IconChartBar,
  IconCirclePlus,
  IconDashboard,
  IconFolder,
  IconUsers,
} from '@tabler/icons-react';
import { LifeBuoy, Send } from 'lucide-react';
import { NavUser } from '@/components/navigation/nav-dashboard';
import { NavMain } from '@/components/navigation/nav-main';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarRail,
} from '@/components/ui/sidebar';
import { ModeToggle } from '../features/toggle-dark';
import { NavSecondary } from '../navigation/nav-secondary';

// import { NavSecondary } from './nav-secondary';
// import { ModeToggle } from './toggle-dark';

const data = {
  navMain: [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: IconDashboard,
    },
    {
      title: 'Analytics',
      url: '/dashboard/analytics',
      icon: IconChartBar,
    },
    {
      title: 'Create',
      url: '/dashboard/create',
      icon: IconCirclePlus,
    },
    {
      title: 'Projects',
      url: '#',
      icon: IconFolder,
    },
    {
      title: 'Team',
      url: '#',
      icon: IconUsers,
    },
  ],
  navSecondary: [
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader className="border-sidebar-border h-16 border-b">
        <SidebarMenu>
          <NavUser />
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between items-center gap-2">
          <div>
            <h1 className="text-lg font-semibold">Shortener</h1>
            <span className="text-sm text-muted-foreground">v1.0</span>
          </div>
          <ModeToggle />
        </div>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}
