/* eslint-disable @next/next/no-img-element */
'use client';
import clsx from 'clsx';
import { Session } from 'next-auth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogoutLink } from './LogoutLink';
import { ModeToggle } from './toggle-dark';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger
} from './ui/tooltip';

type NavLink = {
  href: string;
  label: string;
  isActive: boolean;
  isLogout?: boolean;
  isNotImplement?: boolean;
};

function getNavLinks(pathname: string, session: Session | null): NavLink[] {
  const baseLinks: NavLink[] = [
    {
      href: '/',
      label: 'Home',
      isActive: pathname === '/'
    },
    {
      href: '/about',
      label: 'Info',
      isActive: pathname === '/about'
    }
  ];

  const notSessionLinks: NavLink[] = [
    {
      href: '/login',
      label: 'Login',
      isActive: pathname === '/login'
    },
    {
      href: '#',
      label: 'Register',
      isActive: false,
      isNotImplement: true
    }
  ];

  const sessionLinks: NavLink[] = [
    {
      href: '/profile',
      label: 'Profile',
      isActive: pathname === '/profile'
    },
    {
      href: '/logout',
      label: 'Logout',
      isActive: false,
      isLogout: true
    }
  ];

  baseLinks.push(...(session ? sessionLinks : notSessionLinks));

  return baseLinks;
}

export default function Navigation() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const NAV_LINKS = getNavLinks(pathname, session);

  return (
    <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl flex items-center justify-between h-14">
        <Link
          href="/"
          className={clsx(
            'flex items-center gap-4 transition-all ease-in-out delay-75 group',
            pathname === '/'
              ? 'text-foreground hover:text-foreground/90'
              : 'text-foreground/70 hover:text-foreground'
          )}
        >
          <img
            src="/favicon.ico"
            alt="Logo"
            className={clsx(
              'w-8 h-8 rounded-full transition-all ease-in-out delay-75',
              pathname === '/'
                ? 'opacity-100 group-hover:opacity-90'
                : 'opacity-90 group-hover:opacity-100'
            )}
          />
          <span className="hidden sm:block text-md tracking-tighter font-extrabold uppercase">
            URL Shortener
          </span>
        </Link>
        <div className="flex gap-8 items-center">
          <ul className="font-light tracking-tight flex flex-row gap-2">
            {NAV_LINKS.map((link) => {
              if (link.isLogout) {
                return (
                  <li key={link.label}>
                    <LogoutLink className="transition-all ease-in-out delay-75 text-foreground/70 hover:text-foreground" />
                  </li>
                );
              }
              if (link.isNotImplement) {
                return (
                  <TooltipProvider
                    delayDuration={200}
                    skipDelayDuration={500}
                    key={link.label}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <li>
                          <span
                            className="cursor-not-allowed text-gray-400 hover:text-gray-400 pointer-events-none opacity-50 transition-opacity"
                            tabIndex={-1}
                            aria-disabled="true"
                          >
                            register
                          </span>
                        </li>
                      </TooltipTrigger>
                      <TooltipContent>Coming soon</TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                );
              }
              return (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className={clsx(
                      'transition-all ease-in-out delay-75',
                      link.isActive
                        ? 'text-foreground hover:text-foreground/90'
                        : 'text-foreground/70 hover:text-foreground'
                    )}
                  >
                    {link.label.toLowerCase()}
                  </Link>
                </li>
              );
            })}
          </ul>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
}
