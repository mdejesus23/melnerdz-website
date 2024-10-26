import { useState } from 'preact/hooks';
import MobileNav from './MobileNav';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between bg-transparent px-6 py-4 xl:px-0">
        <a
          href="/"
          className="flex flex-row items-end gap-x-1 font-headfont text-2xl font-bold tracking-wide xs:text-3xl"
        >
          <img className="w-8" src="/logo.png" alt="logo" />
          <span>elnerdz</span>
        </a>
        <nav>
          <div class="flex flex-row items-center justify-between gap-y-4 px-3 py-4 xl:px-0">
            <div>
              <ul class="hidden space-x-6 font-medium sm:flex">
                <li>
                  <a href="/projects" class="hover:text-lblue">
                    Projects
                  </a>
                </li>
                <li>
                  <a href="/contact" class="hover:text-lblue">
                    Contact
                  </a>
                </li>
                <li>
                  <a
                    class="hover:text-lblue"
                    href="https://github.com/mdejesus23"
                    target="_blank"
                  >
                    Github
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </nav>
        <button
          className="sm:hidden"
          onClick={() => setIsOpen((prev) => !prev)}
        >
          {isOpen ? (
            <svg class="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Close</title>
              <polygon
                points="11 9 22 9 22 11 11 11 11 22 9 22 9 11 -2 11 -2 9 9 9 9 -2 11 -2"
                transform="rotate(45 10 10)"
              ></polygon>
            </svg>
          ) : (
            <svg class="h-6 fill-current" viewBox="0 0 20 20">
              <title>Menu Open</title>
              <path d="M0 3h20v2H0V3z m0 6h20v2H0V9z m0 6h20v2H0V0z"></path>
            </svg>
          )}
        </button>
      </header>
      {isOpen && <MobileNav />}
    </>
  );
}

export default Header;
