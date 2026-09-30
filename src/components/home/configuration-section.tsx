"use client";

import { memo } from "react";

import { ExportSettings } from "@/components/home/export-settings";
import { FetchConfig } from "@/components/home/fetch-config";
import { ThemeSelector } from "@/components/home/theme-selector";

export const ConfigurationSection = memo(() => (
  <div className="flex flex-col h-full">
    <div className="flex items-center gap-2 border-b px-4 py-2">
      <h2 className="font-semibold">Configuration</h2>
    </div>

    <div className="p-4 flex-1">
      <FetchConfig />

      <ThemeSelector />

      <ExportSettings />
    </div>
  </div>
));

ConfigurationSection.displayName = "ConfigurationSection";
