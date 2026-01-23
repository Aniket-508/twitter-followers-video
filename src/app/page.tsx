"use client";

import { Player } from "@remotion/player";
import type { NextPage } from "next";
import { useMemo, useState } from "react";
import { z } from "zod";
import {
  defaultMyCompProps,
  CompositionProps,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
  XTheme,
} from "@/types/constants";
import { Main } from "../remotion/MyComp/Main";
import { Input } from "../components/ui/input";
import { cn } from "@/lib/utils";
import { Label } from "@/components/ui/label";

const THEME_OPTIONS: { value: XTheme; label: string; description: string }[] = [
  { value: "light", label: "Light", description: "White background" },
  { value: "dim", label: "Dim", description: "Dark blue background" },
  {
    value: "lightsOut",
    label: "Lights Out",
    description: "Pure black background",
  },
];

const Home: NextPage = () => {
  const [followerCount, setFollowerCount] = useState<number>(
    defaultMyCompProps.followerCount,
  );
  const [theme, setTheme] = useState<XTheme>(defaultMyCompProps.theme);
  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      followerCount,
      theme,
    };
  }, [followerCount, theme]);

  return (
    <main className="view-container py-12">
      <div className="space-y-2 mb-12 text-center sm:text-left">
        <h1 className="text-4xl font-serif italic text-foreground">
          Celebration Video
        </h1>
        <p className="text-muted-foreground text-lg">
          Generate animated videos to celebrate and share your X follower
          milestones.
        </p>
      </div>

      <div className="space-y-8">
        {/* Inputs Section */}
        <div className="space-y-6">
          <div className="space-y-4">
            <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider">
              Configuration
            </h2>
            <div className="grid gap-6">
              <Label>Follower Count (Numeric)</Label>
              <Input
                type="number"
                value={followerCount}
                onChange={(e) => setFollowerCount(Number(e.target.value) || 0)}
                min={1}
              />

              <div className="space-y-2">
                <Label>Theme</Label>
                <div className="flex flex-wrap gap-2">
                  {THEME_OPTIONS.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={cn(
                        "px-3 py-1.5 text-sm rounded-md transition-colors border",
                        theme === option.value
                          ? "bg-foreground text-background border-foreground"
                          : "bg-transparent text-foreground/70 border-foreground/20 hover:border-foreground/50",
                      )}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Preview Section */}
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground uppercase tracking-wider flex items-center justify-between">
            <span>Preview</span>
          </h2>

          <div className="rounded-lg overflow-hidden border border-foreground/10 bg-muted/30 shadow-sm">
            <div className="aspect-video w-full relative">
              <Player
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
          <div className="flex justify-end">
            {/* <DownloadButton /> - Needs update to be cleaner or integrated */}
            {/* Placeholder for download button if needed, or keep existing one but styled */}
          </div>
        </div>
      </div>
    </main>
  );
};
export default Home;
