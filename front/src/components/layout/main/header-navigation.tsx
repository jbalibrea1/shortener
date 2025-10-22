/* eslint-disable @next/next/no-img-element */
'use client';
import { type Icon, IconInfoCircle, IconUser } from '@tabler/icons-react';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import type { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import DropdownLogged from './dropDownLogged';
import { ModeToggle } from '@/components/features/toggle-dark';

type NavLink = {
  href: string;
  label: string;
  icon?: Icon;
  isLogout?: boolean;
  isNotImplement?: boolean;
};

function getNavLinks(session: Session | null): NavLink[] {
  const baseLinks: NavLink[] = [
    {
      href: '/about',
      label: 'About',
      icon: IconInfoCircle,
    },
  ];

  const notSessionLinks: NavLink[] = [
    {
      href: '/login',
      label: 'Login',
      icon: IconUser,
    },
  ];

  return session ? baseLinks : [...notSessionLinks, ...baseLinks];
}

export default function HeaderNavigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const NAV_LINKS = getNavLinks(session);

  return (
    <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container max-w-(--breakpoint-xl) flex items-center justify-between h-14">
        <Link
          href="/"
          className={clsx(
            'flex items-center gap-4 transition-all ease-in-out delay-75 group',
            pathname === '/'
              ? 'text-foreground hover:text-foreground/90'
              : 'text-foreground/70 hover:text-foreground'
          )}
        >
          <Image
            width={32}
            height={32}
            src="/favicon.ico"
            alt="Logo"
            className={clsx(
              'rounded-full transition-all ease-in-out delay-75',
              pathname === '/'
                ? 'opacity-100 group-hover:opacity-90'
                : 'opacity-90 group-hover:opacity-100'
            )}
          />
        </Link>
        <div className="flex gap-4 items-center">
          <nav className="font-light tracking-tight flex flex-row items-center gap-0.5">
            {session && <DropdownLogged />}
            {NAV_LINKS.map((item) => {
              // if (item.isNotImplement) {
              //   return (
              //     <TooltipProvider
              //       delayDuration={200}
              //       skipDelayDuration={500}
              //       key={item.label}
              //     >
              //       <Tooltip>
              //         <TooltipTrigger asChild>
              //           <li>
              //             {item.icon && <item.icon />}
              //             <span
              //               className="cursor-not-allowed text-gray-400 hover:text-gray-400 pointer-events-none opacity-50 transition-opacity "
              //               tabIndex={-1}
              //               aria-disabled="true"
              //             >
              //               {item.label}
              //             </span>
              //           </li>
              //         </TooltipTrigger>
              //         <TooltipContent>Coming soon</TooltipContent>
              //       </Tooltip>
              //     </TooltipProvider>
              //   );
              // }
              return (
                <Button variant="ghost" key={item.href} asChild size="sm">
                  <Link
                    href={item.href}
                    className={clsx(
                      'flex h-[40px] grow items-center justify-center',
                      {
                        'text-primary': pathname === item.href,
                      }
                    )}
                  >
                    {item.icon && <item.icon className="size-5" />}
                    {item.label}
                  </Link>
                </Button>
              );
            })}
          </nav>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
