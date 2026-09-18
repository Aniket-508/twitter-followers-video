import Link from "next/link";

import { LINK } from "@/constants/site";
import { LogoMark } from "./logo";
import { NavItemGitHub } from "./nav-item-github";
import { ThemeToggle } from "./theme-toggle";
import { Separator } from "./ui/separator";
import { Icons } from "./icons";
import { Button } from "./ui/button";

export const SiteHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="px-2 flex h-12 items-center justify-between">
      <div className="flex items-center gap-2 font-serif italic text-xl font-bold">
        <Link href="/">
          <LogoMark className="h-8" />
        </Link>
      </div>
      <nav className="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          nativeButton={false}
          render={
            <a
              href={LINK.TWITTER}
              target="_blank"
              rel="noreferrer"
              aria-label="Follow on X"
            />
          }
        >
          <Icons.x />
        </Button>
        <Separator
          orientation="vertical"
          className="h-4 data-[orientation=vertical]:self-center mx-2"
        />
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
