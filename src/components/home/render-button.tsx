"use client";

import { DownloadIcon, FilePlayIcon, Loader2Icon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { COMP_NAME } from "@/constants/remotion";
import { useConfig } from "@/contexts/config-context";
import { useRendering } from "@/helpers/use-rendering";
import { cn } from "@/lib/utils";

export const RenderButton = () => {
  const { inputProps } = useConfig();
  const { renderMedia, state } = useRendering(COMP_NAME, inputProps);

  const isRendering = state.status === "rendering";
  const isLoading = state.status === "invoking" || isRendering;
  const isDone = state.status === "done";
  const isError = state.status === "error";
  const downloadFileName = isDone ? "milestone-video.mp4" : undefined;

  const Icon = isLoading ? Loader2Icon : isDone ? DownloadIcon : FilePlayIcon;
  const label = (() => {
    if (isRendering) {
      return `Rendering... ${Math.round(state.progress * 100)}%`;
    }
    if (isLoading) {
      return "Preparing Render...";
    }
    if (isDone) {
      return "Download Video";
    }
    return "Export as MP4";
  })();

  const helperText = (() => {
    if (isError) {
      return state.error.message;
    }
    if (isDone) {
      return "Rendered on your device. Re-download anytime without re-rendering.";
    }
    if (isRendering) {
      return "Encoding on your computer. Keep this tab open.";
    }
    if (isLoading) {
      return "Preparing render...";
    }
    return "Renders on your device — keep this tab open until the download starts.";
  })();

  return (
    <div className="space-y-1">
      <Button
        onClick={isDone ? undefined : renderMedia}
        disabled={isLoading}
        nativeButton={!isDone}
        render={
          isDone ? <a href={state.url} download={downloadFileName} /> : undefined
        }
        className="w-full"
      >
        <Icon className={cn(isLoading && "animate-spin")} />
        <span className="font-semibold">{label}</span>
      </Button>

      <p
        className={cn(
          "text-xs text-muted-foreground text-center",
          isError && "text-destructive"
        )}
      >
        {helperText}
      </p>
    </div>
  );
};
