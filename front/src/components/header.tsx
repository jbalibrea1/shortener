/* eslint-disable @next/next/no-img-element */
'use client';
import clsx from 'clsx';
import { usePathname } from 'next/navigation';
import { ModeToggle } from './toggle-dark';

const Header = () => {
  const pathname = usePathname();
  return (
    <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl flex items-center justify-between h-14">
        <a
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
        </a>
        <div className="flex gap-8 items-center">
          <ul className="font-light tracking-tight flex flex-row gap-2">
            <li>
              <a
                href="/about"
                className={clsx(
                  'transition-all ease-in-out delay-75',
                  pathname === '/about'
                    ? 'text-foreground hover:text-foreground/90'
                    : 'text-foreground/70 hover:text-foreground'
                )}
              >
                info
              </a>
            </li>
            <li>
              <a
                href="#"
                className="cursor-not-allowed text-gray-400 hover:text-gray-400 pointer-events-none opacity-90 hover:opacity-100 transition-opacity "
              >
                register
              </a>
            </li>
          </ul>
          <ModeToggle />
        </div>
      </div>
    </header>
  );
};
export default Header;
