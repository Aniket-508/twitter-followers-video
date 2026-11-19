"use client";

import { memo } from "react";

import { Button } from "@/components/ui/button";
import type { ExportFormat, ExportQuality } from "@/constants/export";
import {
  EXPORT_FORMATS,
  EXPORT_QUALITIES,
  getExportDimensions,
} from "@/constants/export";
import { useConfig } from "@/contexts/config-context";

const FORMAT_OPTIONS = Object.keys(EXPORT_FORMATS) as ExportFormat[];
const QUALITY_OPTIONS = Object.keys(EXPORT_QUALITIES) as ExportQuality[];

export const ExportSettings = memo(() => {
  const { exportFormat, setExportFormat, exportQuality, setExportQuality } =
    useConfig();
  const dimensions = getExportDimensions(exportQuality);

  return (
    <div className="mt-4 space-y-4">
      <fieldset className="min-w-0 space-y-2">
        <legend className="text-sm leading-none font-medium">Format</legend>
        <div className="flex flex-wrap gap-2">
          {FORMAT_OPTIONS.map((format) => (
            <Button
              key={format}
              variant={exportFormat === format ? "default" : "outline"}
              onClick={() => setExportFormat(format)}
            >
              {EXPORT_FORMATS[format].label}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          {EXPORT_FORMATS[exportFormat].description}
        </p>
      </fieldset>

      <fieldset className="min-w-0 space-y-2">
        <legend className="text-sm leading-none font-medium">Quality</legend>
        <div className="flex flex-wrap gap-2">
          {QUALITY_OPTIONS.map((quality) => (
            <Button
              key={quality}
              variant={exportQuality === quality ? "default" : "outline"}
              onClick={() => setExportQuality(quality)}
            >
              {EXPORT_QUALITIES[quality].label}
            </Button>
          ))}
        </div>
        <p className="text-muted-foreground text-xs">
          {dimensions.width}x{dimensions.height} — higher quality takes longer
          to render in your browser
        </p>
      </fieldset>
    </div>
  );
});

ExportSettings.displayName = "ExportSettings";
