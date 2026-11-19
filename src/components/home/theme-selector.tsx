"use client";

import { memo } from "react";

import { Button } from "@/components/ui/button";
import { useConfig } from "@/contexts/config-context";
import type { XTheme } from "@/types/schema";

const THEME_OPTIONS: { value: XTheme; label: string; description: string }[] = [
  { description: "White background", label: "Light", value: "light" },
  { description: "Dark blue background", label: "Dim", value: "dim" },
  {
    description: "Pure black background",
    label: "Lights Out",
    value: "lightsOut",
  },
];

export const ThemeSelector = memo(() => {
  const { theme, setTheme } = useConfig();

  return (
    <fieldset className="mt-4 min-w-0 space-y-2">
      <legend className="text-sm leading-none font-medium">Theme</legend>
      <div className="flex flex-wrap gap-2">
        {THEME_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={theme === option.value ? "default" : "outline"}
            onClick={() => setTheme(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </fieldset>
  );
});

ThemeSelector.displayName = "ThemeSelector";
