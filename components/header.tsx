import Link from "next/link";
import { Button } from "./ui/button";

// components
import Nav from "./nav";
import MobileNav from "./mobileNav";

const Header = () => {
  return (
    <header className="py-8 xl:py-12 text-white px-6 sm:px-6 md:px-0">
      <div className="container mx-auto  flex justify-between items-center">
        {/* logo */}
        <Link href="/">
          <h1 className="text-4xl font-semibold">
            William<span className="text-accent-default">.</span>
          </h1>
        </Link>

        {/* desktop nav & hire me button */}
        <div className="hidden xl:flex items-center gap-8">
          <Nav />
          <Link href="/contact">
            <Button>Hire me</Button>
          </Link>
        </div>

        {/* mobile nav */}

        <div className="xl:hidden">
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
