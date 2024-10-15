/* eslint-disable @next/next/no-img-element */
import { ModeToggle } from './toggle-dark';

const Header = () => {
  return (
    <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl flex items-center justify-between h-14">
        <a href="/" className="flex items-center space-x-2">
          <img
            src="/favicon.ico"
            alt="Logo"
            className="w-10 h-10 rounded-full"
          />
          <span className="hidden sm:block md:text-xl font-bold">
            URL Shortener
          </span>
        </a>
        <div className="flex gap-8 items-center">
          <ul className="font-light tracking-tight flex flex-row gap-2">
            <li>
              <a
                href="/about"
                className="text-primary hover:text-primary-dark opacity-90 hover:opacity-100 transition-opacity "
              >
                about
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
