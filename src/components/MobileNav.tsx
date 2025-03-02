function MobileNav() {
  return (
    <nav>
      <div className="flex w-full flex-col items-center justify-center gap-y-4 sm:hidden xl:px-0">
        <ul className="flex w-full flex-col items-start bg-project px-4 py-3 font-medium">
          <li className="py-2 font-medium text-white">
            <a href="/projects" className="hover:text-lblue">
              Projects
            </a>
          </li>
          <li className="py-2 font-medium text-white">
            <a href="/blogs" className="hover:text-lblue">
              Blogs
            </a>
          </li>
          <li className="py-2 font-medium text-white">
            <a href="/contact" className="hover:text-lblue">
              Contact
            </a>
          </li>
          <li className="py-2 font-medium text-white">
            <a
              className="hover:text-lblue"
              href="https://github.com/mdejesus23"
              target="_blank"
            >
              Github
            </a>
          </li>
          <li className="py-2 font-medium text-white">
            <a
              className="hover:text-lblue"
              href="https://github.com/mdejesus23"
              target="_blank"
            >
              CV
            </a>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default MobileNav;
