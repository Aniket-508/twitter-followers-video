"use client";

import { useRendering } from "@/helpers/use-rendering";
import { useConfig } from "@/contexts/config-context";
import { COMP_NAME } from "@/constants/remotion";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  DownloadIcon,
  Loader2Icon,
  AlertCircleIcon,
  CircleCheckIcon,
} from "lucide-react";

export function RenderButton() {
  const { inputProps } = useConfig();
  const { renderMedia, state } = useRendering(COMP_NAME, inputProps);

  const isRendering = state.status === "rendering";
  const isLoading = state.status === "invoking" || isRendering;
  const isDone = state.status === "done";

  return (
    <div className="relative z-[1] space-y-2">
      <Button
        onClick={isDone ? undefined : renderMedia}
        disabled={isLoading}
        render={
          isDone ? (
            <a
              href={state.url}
              download={`milestone-video-${Date.now()}.mp4`}
            />
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
                ? `Rendering ${Math.round(state.progress * 100)}%`
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
}
