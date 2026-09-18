import type {
  WebRendererContainer,
  WebRendererVideoCodec,
} from "@remotion/web-renderer";

import { VIDEO_HEIGHT, VIDEO_WIDTH } from "@/constants/remotion";

export type ExportFormat = "mp4" | "webm";

/**
 * GIF is intentionally absent: `@remotion/web-renderer` encodes through
 * WebCodecs and only supports the containers listed in `WebRendererContainer`.
 */
export const EXPORT_FORMATS = {
  mp4: {
    container: "mp4",
    description: "H.264 — plays everywhere",
    extension: "mp4",
    label: "MP4",
    videoCodec: "h264",
  },
  webm: {
    container: "webm",
    description: "VP9 — smaller file, web-native",
    extension: "webm",
    label: "WebM",
    videoCodec: "vp9",
  },
} satisfies Record<
  ExportFormat,
  {
    container: WebRendererContainer;
    description: string;
    extension: string;
    label: string;
    videoCodec: WebRendererVideoCodec;
  }
>;

export type ExportQuality = "fhd" | "qhd" | "uhd";

/** `scale` multiplies the composition resolution at render time. */
export const EXPORT_QUALITIES = {
  fhd: { label: "FHD", scale: 1 },
  qhd: { label: "2K", scale: 4 / 3 },
  uhd: { label: "4K", scale: 2 },
} satisfies Record<ExportQuality, { label: string; scale: number }>;

export const DEFAULT_EXPORT_FORMAT: ExportFormat = "mp4";
export const DEFAULT_EXPORT_QUALITY: ExportQuality = "fhd";

/** h264/h265 reject odd dimensions, so round to the nearest even pixel. */
const toEvenPixels = (value: number) => Math.round(value / 2) * 2;

export const getExportDimensions = (quality: ExportQuality) => {
  const { scale } = EXPORT_QUALITIES[quality];

  return {
    height: toEvenPixels(VIDEO_HEIGHT * scale),
    width: toEvenPixels(VIDEO_WIDTH * scale),
  };
};
