import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { z } from "zod";

import type { ExportFormat, ExportQuality } from "@/constants/export";
import {
  EXPORT_FORMATS,
  EXPORT_QUALITIES,
  getExportDimensions,
} from "@/constants/export";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/constants/remotion";
import { Followers } from "@/remotion/followers";
import { LAYOUT } from "@/remotion/templates/shared/constants";
import {
  calculateMaxAvatars,
  getDicebearUrl,
} from "@/remotion/templates/shared/utils";
import type { Follower } from "@/types/schema";
import { CompositionProps, defaultMyCompProps } from "@/types/schema";

export type State =
  | {
      status: "init";
    }
  | {
      status: "invoking";
    }
  | {
      progress: number;
      phase: string;
      status: "rendering";
    }
  | {
      status: "error";
      error: Error;
    }
  | {
      url: string;
      size: number;
      fileName: string;
      status: "done";
    };

export interface RenderOptions {
  format: ExportFormat;
  quality: ExportQuality;
}

const MAX_RENDERED_AVATARS = calculateMaxAvatars(
  VIDEO_WIDTH + LAYOUT.SCROLL_DISTANCE
);
const VIDEO_QUALITY = "very-high" as const;

const isAbortError = (error: unknown) =>
  error instanceof DOMException && error.name === "AbortError";

const fetchImageAsObjectUrl = async (
  source: string,
  signal: AbortSignal
): Promise<{ objectUrl: string; owned: boolean } | null> => {
  if (source.startsWith("blob:") || source.startsWith("data:")) {
    return { objectUrl: source, owned: false };
  }

  try {
    const response = await fetch(source, { mode: "cors", signal });
    if (!response.ok) {
      return null;
    }

    const blob = await response.blob();
    if (!blob.type.startsWith("image/")) {
      return null;
    }

    return { objectUrl: URL.createObjectURL(blob), owned: true };
  } catch (error) {
    if (isAbortError(error)) {
      throw error;
    }
    return null;
  }
};

const getPreferredImageSources = (source: string): string[] => {
  try {
    const url = new URL(source);
    if (url.hostname !== "pbs.twimg.com") {
      return [source];
    }

    const originalPath = url.pathname.replace(
      /_(?:normal|bigger|mini)(?=\.[^./]+$)/u,
      ""
    );
    if (originalPath === url.pathname) {
      return [source];
    }

    url.pathname = originalPath;
    return [url.toString(), source];
  } catch {
    return [source];
  }
};

const fetchFirstAvailableImageAsObjectUrl = async (
  sources: string[],
  signal: AbortSignal
): Promise<{ objectUrl: string; owned: boolean } | null> => {
  const [source, ...remainingSources] = sources;
  if (!source) {
    return null;
  }

  const preparedImage = await fetchImageAsObjectUrl(source, signal);
  return (
    preparedImage ||
    fetchFirstAvailableImageAsObjectUrl(remainingSources, signal)
  );
};

const prepareFollowerForRender = async (
  follower: Follower,
  signal: AbortSignal
): Promise<{ follower: Follower; objectUrl?: string }> => {
  const fallback = getDicebearUrl(follower.name);
  const sources = follower.image
    ? [...getPreferredImageSources(follower.image), fallback]
    : [fallback];
  const preparedImage = await fetchFirstAvailableImageAsObjectUrl(
    sources,
    signal
  );

  if (preparedImage) {
    return {
      follower: { ...follower, image: preparedImage.objectUrl },
      objectUrl: preparedImage.owned ? preparedImage.objectUrl : undefined,
    };
  }

  return {
    follower: { ...follower, image: fallback },
  };
};

const prepareInputProps = async (
  inputProps: z.infer<typeof CompositionProps>,
  signal: AbortSignal
) => {
  if (!inputProps.followers?.length) {
    return { inputProps, objectUrls: [] as string[] };
  }

  const prepared = await Promise.all(
    inputProps.followers
      .slice(0, MAX_RENDERED_AVATARS)
      .map((follower) => prepareFollowerForRender(follower, signal))
  );
  const objectUrls = prepared.flatMap(({ objectUrl }) =>
    objectUrl ? [objectUrl] : []
  );
  const followers = [
    ...prepared.map(({ follower }) => follower),
    ...inputProps.followers.slice(MAX_RENDERED_AVATARS),
  ];

  return {
    inputProps: { ...inputProps, followers },
    objectUrls,
  };
};

export const useRendering = (
  id: string,
  inputProps: z.infer<typeof CompositionProps>,
  { format, quality }: RenderOptions
) => {
  const [state, setState] = useState<State>({
    status: "init",
  });
  const abortControllerRef = useRef<AbortController | null>(null);
  const outputUrlRef = useRef<string | null>(null);

  const revokeOutputUrl = useCallback(() => {
    if (outputUrlRef.current) {
      URL.revokeObjectURL(outputUrlRef.current);
      outputUrlRef.current = null;
    }
  }, []);

  useEffect(
    () => () => {
      abortControllerRef.current?.abort();
      revokeOutputUrl();
    },
    [revokeOutputUrl]
  );

  const undo = useCallback(() => {
    abortControllerRef.current?.abort();
    revokeOutputUrl();
    setState({ status: "init" });
  }, [revokeOutputUrl]);

  // A finished render belongs to the format/quality it was made with.
  useEffect(() => {
    if (outputUrlRef.current) {
      undo();
    }
  }, [format, quality, undo]);

  const renderMedia = useCallback(async () => {
    abortControllerRef.current?.abort();
    revokeOutputUrl();

    const controller = new AbortController();
    abortControllerRef.current = controller;
    const assetObjectUrls: string[] = [];

    setState({ status: "invoking" });

    const { container, extension, label, videoCodec } = EXPORT_FORMATS[format];
    const { scale } = EXPORT_QUALITIES[quality];
    const dimensions = getExportDimensions(quality);

    try {
      const { canRenderMediaOnWeb, renderMediaOnWeb } =
        await import("@remotion/web-renderer");
      const compatibility = await canRenderMediaOnWeb({
        container,
        height: dimensions.height,
        muted: true,
        videoBitrate: VIDEO_QUALITY,
        videoCodec,
        width: dimensions.width,
      });

      if (!compatibility.canRender) {
        const details = compatibility.issues
          .map(({ message }) => message)
          .join(" ");
        throw new Error(
          `This browser cannot export a ${label} at ${dimensions.width}x${dimensions.height}. ${details}`.trim()
        );
      }

      setState({
        phase: "Preparing avatars...",
        progress: 0,
        status: "rendering",
      });

      const prepared = await prepareInputProps(inputProps, controller.signal);
      assetObjectUrls.push(...prepared.objectUrls);

      const licenseKey = process.env.NEXT_PUBLIC_REMOTION_LICENSE_KEY;
      const result = await renderMediaOnWeb({
        composition: {
          component: Followers,
          defaultProps: defaultMyCompProps,
          durationInFrames: DURATION_IN_FRAMES,
          fps: VIDEO_FPS,
          height: VIDEO_HEIGHT,
          id,
          width: VIDEO_WIDTH,
        },
        container,
        inputProps: prepared.inputProps,
        muted: true,
        onProgress: ({ progress }) => {
          setState({
            phase: "Rendering in your browser...",
            progress,
            status: "rendering",
          });
        },
        pageResponsiveness: "high",
        scale,
        schema: CompositionProps,
        signal: controller.signal,
        videoBitrate: VIDEO_QUALITY,
        videoCodec,
        ...(licenseKey
          ? {
              isProduction: process.env.NODE_ENV === "production",
              licenseKey,
            }
          : {}),
      });

      setState({
        phase: "Preparing download...",
        progress: 1,
        status: "rendering",
      });

      const blob = await result.getBlob();
      const url = URL.createObjectURL(blob);
      outputUrlRef.current = url;
      setState({
        fileName: `milestone-video.${extension}`,
        size: blob.size,
        status: "done",
        url,
      });
    } catch (error) {
      if (!isAbortError(error)) {
        setState({ error: error as Error, status: "error" });
      }
    } finally {
      for (const objectUrl of assetObjectUrls) {
        URL.revokeObjectURL(objectUrl);
      }
      if (abortControllerRef.current === controller) {
        abortControllerRef.current = null;
      }
    }
  }, [format, id, inputProps, quality, revokeOutputUrl]);

  return useMemo(
    () => ({
      renderMedia,
      state,
      undo,
    }),
    [renderMedia, state, undo]
  );
};
