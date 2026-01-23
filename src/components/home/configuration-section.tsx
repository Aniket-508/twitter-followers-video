"use client";

import { useConfig, DataSource } from "@/contexts/config-context";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ManualConfig } from "./manual-config";
import { CSVConfig } from "./csv-config";
import { ThemeSelector } from "./theme-selector";
import { memo } from "react";

export const ConfigurationSection = memo(function ConfigurationSection() {
  const { dataSource, setDataSource } = useConfig();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Configuration
      </h2>

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

      <div className="pt-2">
        <ThemeSelector />
      </div>
    </div>
  );
});
