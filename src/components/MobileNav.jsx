function MobileNav() {
  return (
    <nav>
      <div class="flex w-full flex-col items-center justify-center gap-y-4 sm:hidden xl:px-0">
        <ul class="flex w-full flex-col items-center bg-project py-3 font-medium">
          <li className="py-2 font-bold text-white">
            <a href="/projects" class="hover:text-lblue">
              Projects
            </a>
          </li>
          <li className="py-2 font-bold text-white">
            <a href="/contact" class="hover:text-lblue">
              Contact
            </a>
          </li>
          <li className="py-2 font-bold text-white">
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
    </nav>
  );
}

export default MobileNav;
