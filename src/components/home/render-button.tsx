"use client";

import {
  DownloadIcon,
  Loader2Icon,
  AlertCircleIcon,
  CircleCheckIcon,
} from "lucide-react";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { COMP_NAME } from "@/constants/remotion";
import { useConfig } from "@/contexts/config-context";
import { useRendering } from "@/helpers/use-rendering";

export const RenderButton = () => {
  const { inputProps } = useConfig();
  const { renderMedia, state } = useRendering(COMP_NAME, inputProps);

  const isRendering = state.status === "rendering";
  const isLoading = state.status === "invoking" || isRendering;
  const isDone = state.status === "done";
  const downloadFileName = isDone
    ? `${inputProps.template}-milestone-video.mp4`
    : undefined;

  return (
    <div className="relative z-[1] space-y-2">
      <Button
        onClick={isDone ? undefined : renderMedia}
        disabled={isLoading}
        render={
          isDone ? (
            <a
              href={state.url}
              download={downloadFileName}
              aria-label="Download rendered video"
            >
              Download rendered video
            </a>
          ) : undefined
        }
        size="lg"
        className="w-full"
      >
        {!isLoading && !isDone && (
          <>
            <DownloadIcon />
            <span className="font-semibold">Export as MP4</span>
          </>
        )}
        {isLoading && (
          <>
            <Loader2Icon className="animate-spin" />
            <span className="font-semibold">
              {isRendering
                ? `${state.phase} ${Math.round(state.progress * 100)}%`
                : "Preparing Render..."}
            </span>
          </>
        )}
        {isDone && (
          <>
            <DownloadIcon />
            <span className="font-semibold">Download Video</span>
          </>
        )}

        {/* Progress Bar Background */}
        {isRendering && (
          <div
            className="absolute inset-0 bg-primary/20 transition-all duration-700 ease-out"
            style={{ width: `${state.progress * 100}%` }}
          />
        )}
      </Button>

      {state.status === "error" && (
        <Alert variant="destructive" className="animate-in slide-in-from-top-2">
          <AlertCircleIcon />
          <AlertDescription>{state.error.message}</AlertDescription>
        </Alert>
      )}

      {isDone && (
        <Alert variant="success" className="animate-in slide-in-from-top-2">
          <CircleCheckIcon />
          <AlertDescription>
            Success! Your video is ready for download.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
