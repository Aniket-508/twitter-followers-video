import Link from "next/link";
import { NavItemGitHub } from "./nav-item-github";
import { ThemeToggle } from "./theme-toggle";
import { LogoMark } from "./logo";
import { Separator } from "./ui/separator";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="px-2 flex h-12 items-center justify-between">
        <div className="flex items-center gap-2 font-serif italic text-xl font-bold">
          <Link href="/">
            <LogoMark className="h-8" />
          </Link>
        </div>
        <nav className="flex items-center">
          <NavItemGitHub />
          <Separator
            orientation="vertical"
            className="h-4 data-[orientation=vertical]:self-center mx-2"
          />
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
