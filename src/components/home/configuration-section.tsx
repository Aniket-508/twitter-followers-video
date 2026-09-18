"use client";

import { memo } from "react";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { DataSource } from "@/contexts/config-context";
import { useConfig } from "@/contexts/config-context";

import { CSVConfig } from "./csv-config";
import { ManualConfig } from "./manual-config";
import { ThemeSelector } from "./theme-selector";

export const ConfigurationSection = memo(() => {
  const { dataSource, setDataSource } = useConfig();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <h2 className="font-semibold">Configuration</h2>
      </div>

      <div className="p-4 flex-1">
        <Tabs
          value={dataSource}
          onValueChange={(val) => setDataSource(val as DataSource)}
          className="gap-4"
        >
          <TabsList className="w-full">
            <TabsTrigger value="csv" className="flex-1">
              Upload CSV
            </TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">
              Manual Config
            </TabsTrigger>
          </TabsList>

          <TabsContent value="manual">
            <ManualConfig />
          </TabsContent>
          <TabsContent value="csv">
            <CSVConfig />
          </TabsContent>
        </Tabs>

        <ThemeSelector />
      </div>
    </div>
  );
});

ConfigurationSection.displayName = "ConfigurationSection";
