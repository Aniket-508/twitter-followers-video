import Link from "next/link";
import { NavItemGitHub } from "./nav-item-github";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 max-w-2xl flex h-14 items-center justify-between">
        <div className="flex items-center gap-2 font-serif italic text-xl font-bold">
          <Link href="/" className="flex items-center gap-2">
            <span>Celebration Video</span>
          </Link>
        </div>
        <nav className="flex items-center gap-2">
          {/* <NavItemGitHub /> */}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
