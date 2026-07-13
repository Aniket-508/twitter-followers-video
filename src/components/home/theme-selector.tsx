"use client";

import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-2">
      <Label>Theme</Label>
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
    </div>
  );
});

ThemeSelector.displayName = "ThemeSelector";
