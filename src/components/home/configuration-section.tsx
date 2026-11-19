"use client";

import { memo } from "react";

import { ExportSettings } from "@/components/home/export-settings";
import { FetchConfig } from "@/components/home/fetch-config";
import { ThemeSelector } from "@/components/home/theme-selector";

export const ConfigurationSection = memo(() => (
  <div className="flex h-full flex-col">
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <h2 className="font-semibold">Configuration</h2>
    </div>

    <div className="flex-1 p-4">
      <FetchConfig />

      <ThemeSelector />

      <ExportSettings />
    </div>
  </div>
));

ConfigurationSection.displayName = "ConfigurationSection";
