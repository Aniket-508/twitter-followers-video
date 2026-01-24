"use client";

import { useConfig } from "@/contexts/config-context";
import { Main } from "@/remotion/comp-main";
import {
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/types/constants";
import { memo } from "react";
import dynamic from "next/dynamic";
import { RenderButton } from "./render-button";

// Dynamic import for Player to optimize bundle size (Vercel Best Practices: bundle-dynamic-imports)
const Player = dynamic(
  () => import("@remotion/player").then((mod) => mod.Player),
  {
    ssr: false,
    loading: () => (
      <div className="aspect-video w-full flex items-center justify-center bg-muted/20 animate-pulse rounded-2xl">
        <div className="text-muted-foreground text-sm font-medium">
          Loading player...
        </div>
      </div>
    ),
  },
);

export const PreviewSection = memo(function PreviewSection() {
  const { inputProps } = useConfig();

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
        Video Preview
      </h2>

      <div className="group relative rounded-3xl overflow-hidden border border-muted-foreground/10 shadow-2xl transition-all hover:border-primary/20">
        <div className="aspect-video w-full">
          <Player
            // @ts-expect-error - Player component prop has type mismatch with dynamically imported Main
            component={Main}
            inputProps={inputProps}
            durationInFrames={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              width: "100%",
              height: "100%",
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
