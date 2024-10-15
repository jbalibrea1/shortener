import SvgGithub from './svg-github';

export default function Footer() {
  return (
    <footer className="container max-w-screen-xl flex flex-row justify-end items-center p-4 gap-2 text-sm font-light tracking-wide ">
      <div className="flex gap-2 items-center">
        <span>
          by <strong>jbalibrea</strong>
        </span>
        <a href="https://github.com/jbalibrea1" target="_blank">
          <SvgGithub color="text-foreground" />
        </a>
      </div>
    </footer>
  );
}
