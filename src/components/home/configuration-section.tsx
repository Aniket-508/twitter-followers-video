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
    <div className="space-y-2">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Configuration
      </h2>

      <div className="flex flex-col gap-6">
        <Tabs
          value={dataSource}
          onValueChange={(val) => setDataSource(val as DataSource)}
        >
          <TabsList className="w-full mb-2">
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
