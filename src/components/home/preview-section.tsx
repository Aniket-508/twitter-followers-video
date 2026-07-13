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
import { FollowerAccumulation } from "@/remotion/follower-accumulation";

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
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Video Preview
      </h2>

      <div className="group relative rounded-3xl overflow-hidden border border-muted-foreground/10 shadow-2xl transition-all hover:border-primary/20">
        <div className="aspect-video w-full">
          <Player
            // @ts-expect-error - Player component prop has type mismatch with dynamically imported FollowerAccumulation
            component={FollowerAccumulation}
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

      <RenderButton />
    </div>
  );
});

PreviewSection.displayName = "PreviewSection";
