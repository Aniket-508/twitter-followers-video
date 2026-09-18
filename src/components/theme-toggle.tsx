"use client";

import { useTheme } from "next-themes";
import { useCallback } from "react";
import { useHotkeys } from "react-hotkeys-hook";

import { MoonIcon } from "@/components/animated-icons/moon";
import { SunIcon } from "@/components/animated-icons/sun";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useSound } from "@/hooks/use-sound";

export const ThemeToggle = () => {
  const { resolvedTheme, setTheme } = useTheme();

  const playClick = useSound("/audio/click.wav");

  const switchTheme = useCallback(() => {
    playClick(0.5);
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }, [resolvedTheme, setTheme, playClick]);

  useHotkeys("d", switchTheme);

  return (
    <Tooltip>
      <TooltipTrigger
        render={<Button variant="ghost" size="icon" onClick={switchTheme} />}
      >
        <MoonIcon className="relative hidden after:absolute after:-inset-2 [html.dark_&]:block" />
        <SunIcon className="relative hidden after:absolute after:-inset-2 [html.light_&]:block" />
        <span className="sr-only">Theme Toggle</span>
      </TooltipTrigger>

      <TooltipContent className="pr-2 pl-3">
        <div className="flex items-center gap-3">
          Toggle Mode
          <Kbd>D</Kbd>
        </div>
      </TooltipContent>
    </Tooltip>
  );
};
