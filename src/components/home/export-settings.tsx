"use client";

import { memo } from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-4 mt-4">
      <div className="space-y-2">
        <Label>Format</Label>
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
        <p className="text-xs text-muted-foreground">
          {EXPORT_FORMATS[exportFormat].description}
        </p>
      </div>

      <div className="space-y-2">
        <Label>Quality</Label>
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
        <p className="text-xs text-muted-foreground">
          {dimensions.width}x{dimensions.height} — higher quality takes longer
          to render in your browser
        </p>
      </div>
    </div>
  );
});

ExportSettings.displayName = "ExportSettings";
