import SvgGithub from './svg-github';

export default function Footer() {
  return (
    <footer className="container max-w-screen-xl flex flex-row justify-end items-center p-4 gap-2 text-sm font-light tracking-wide ">
      <a
        href="https://github.com/jbalibrea1"
        target="_blank"
        rel="noopener noreferrer"
        className="flex gap-2 items-center text-foreground/80 hover:text-foreground fill-foreground/80 hover:fill-foreground group ease-in-out delay-75 "
      >
        <span>
          by <strong>jbalibrea</strong>
        </span>
        <SvgGithub className="text-foreground/80 group-hover:text-foreground ease-in-out delay-75 " />
      </a>
    </footer>
  );
}
