"use client";

import dynamic from "next/dynamic";
import { memo } from "react";

import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/constants/remotion";
import { useConfig } from "@/contexts/config-context";
import { Followers } from "@/remotion/followers";

import { RenderButton } from "./render-button";

const loadPlayer = async () => {
  const mod = await import("@remotion/player");
  return mod.Player;
};

const Player = dynamic(loadPlayer, {
  loading: () => (
    <div className="aspect-video w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-2xl">
      <div className="text-muted-foreground text-sm font-medium">
        Loading player...
      </div>
    </div>
  ),
  ssr: false,
});

export const PreviewSection = memo(() => {
  const { inputProps } = useConfig();

  return (
    <div className="flex flex-col h-full">
      <div className="h-12 flex items-center justify-between gap-2 border-b px-4 py-2 shrink-0">
        <h2 className="font-semibold">Video Preview</h2>
        <RenderButton />
      </div>

      <div className="p-4 flex-1 flex items-center justify-center">
        <div className="group relative rounded-3xl overflow-hidden border border-muted-foreground/10 shadow-2xl w-full">
          <div className="aspect-video w-full">
            <Player
              // @ts-expect-error - Player component prop has type mismatch with dynamically imported Followers
              component={Followers}
              inputProps={inputProps}
              durationInFrames={DURATION_IN_FRAMES}
              fps={VIDEO_FPS}
              compositionHeight={VIDEO_HEIGHT}
              compositionWidth={VIDEO_WIDTH}
              style={{
                height: "100%",
                width: "100%",
              }}
              controls
              autoPlay
              loop
            />
          </div>
        </div>
      </div>
    </div>
  );
});

PreviewSection.displayName = "PreviewSection";
