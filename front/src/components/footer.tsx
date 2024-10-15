export default function Footer() {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="container max-w-screen-xl flex flex-col sm:flex-row justify-between items-center text-gray-900 dark:text-white p-4 text-base gap-2 font-light tracking-wider ">
      <div className="flex space-x-1">
        <span> Jorge Balibrea - {currentYear}</span>
      </div>
      <p>Created w/ nextjs + shadcn</p>
    </footer>
  );
}
