"use client";

import dynamic from "next/dynamic";
import { memo } from "react";

import { RenderButton } from "@/components/home/render-button";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/constants/remotion";
import { useConfig } from "@/contexts/config-context";
import { Followers } from "@/remotion/followers";

const loadPlayer = async () => {
  const mod = await import("@remotion/player");
  return mod.Player;
};

const Player = dynamic(loadPlayer, {
  loading: () => (
    <div className="bg-muted/20 flex aspect-video w-full animate-pulse items-center justify-center rounded-2xl">
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
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b px-4 py-2">
        <h2 className="font-semibold">Preview</h2>
      </div>

      <div className="flex flex-1 items-center justify-center p-4">
        <div className="group border-muted-foreground/10 relative w-full overflow-hidden rounded-3xl border shadow-2xl">
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

      <div className="shrink-0 border-t px-4 py-3">
        <RenderButton />
      </div>
    </div>
  );
});

PreviewSection.displayName = "PreviewSection";
