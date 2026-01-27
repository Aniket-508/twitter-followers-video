"use client";

import { useConfig } from "@/contexts/config-context";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { XTheme } from "@/types/schema";
import { memo } from "react";

const THEME_OPTIONS: { value: XTheme; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "White background" },
  { value: "dim", label: "Dim", description: "Dark blue background" },
  {
    value: "lightsOut",
    label: "Lights Out",
    description: "Pure black background",
  },
];

export const ThemeSelector = memo(function ThemeSelector() {
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
