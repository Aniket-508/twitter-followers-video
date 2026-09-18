import Link from "next/link";

import { Icons } from "@/components/icons";
import { LogoMark } from "@/components/logo";
import { NavItemGitHub } from "@/components/nav-item-github";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { LINK } from "@/constants/site";

export const SiteHeader = () => (
  <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
    <div className="px-4 flex h-12 items-center justify-between">
      <Link href="/">
        <LogoMark className="h-4" />
      </Link>
      <nav className="flex items-center">
        <Tooltip>
          <TooltipTrigger
            render={
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
            }
          />
          <TooltipContent>Follow on X</TooltipContent>
        </Tooltip>
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
