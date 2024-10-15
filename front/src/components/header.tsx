import { ModeToggle } from './toggle-dark';

const Header = () => {
  return (
    <header className="top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container max-w-screen-xl flex items-center justify-between h-14">
        <h1 className="text-2xl font-bold">Acortador URL</h1>
        <ModeToggle />
      </div>
    </header>
  );
};
export default Header;
