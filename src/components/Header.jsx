import { useState } from 'preact/hooks';
import MobileNav from './MobileNav';

function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <header className="mx-auto flex w-full max-w-5xl items-center justify-between bg-transparent px-6 py-4 xl:px-0">
        {/* <a
          href="/"
          className="flex flex-row items-end gap-x-1 font-headfont text-2xl font-bold tracking-wide xs:text-3xl"
        >
          <img className="w-8" src="/logo.png" alt="logo" />
          <span>elnerdz</span>
        </a> */}
        <a
          href="/"
          class="flex flex-row items-end gap-x-1 font-headfont text-2xl font-bold tracking-wide xs:text-3xl"
        >
          <svg
            class="w-12 fill-current md:w-full"
            width="3.5rem"
            height="3.5rem"
            version="1.1"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m7.9844 12.062 75.875 75.875h7.7812l-75.875-75.875z"
              fill="#05bbc1"
            ></path>
            <path
              d="m5 22.215v63.113l31.438-31.438 2.7969 2.8008-31.25 31.246h7.7773l27.359-27.359 2.8008 2.8008-24.562 24.559h7.7773l20.672-20.672 20.672 20.672h7.7773l-73.258-73.262zm5.5 5.7383 3.957 3.957v36.18l-3.957 3.957zm9.457 9.457 3.957 3.957v17.262l-3.957 3.957zm9.457 15.723v-6.2617l3.1328 3.1289z"
              fill="#05bbc1"
            ></path>
            <path
              d="m95 14.297-31.812 31.812-2.8008-2.8008 31.25-31.246h-7.7773l-27.359 27.359-2.7969-2.7969 24.562-24.562h-7.7773l-20.676 20.672-20.672-20.672h-7.7812l73.641 73.641v-7.7812l-0.066406-0.066406h0.066406v-55.641h-0.13672l0.13672-0.13672zm-14.957 22.738v25.93l-3.957-3.957v-18.016zm-9.457 9.457v7.0117l-3.5078-3.5039zm18.914 25.93-3.957-3.9609v-36.926l3.957-3.957z"
              fill="#05bbc1"
            ></path>
          </svg>
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
