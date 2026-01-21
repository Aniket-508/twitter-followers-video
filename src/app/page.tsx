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
} from "../../types/constants";
import { Spacing } from "../components/Spacing";
import { Main } from "../remotion/MyComp/Main";

const Home: NextPage = () => {
  const [followerCount, setFollowerCount] = useState<number>(defaultMyCompProps.followerCount);

  const inputProps: z.infer<typeof CompositionProps> = useMemo(() => {
    return {
      followerCount,
    };
  }, [followerCount]);

  return (
    <div>
      <div className="max-w-screen-md m-auto mb-5">
        <div className="overflow-hidden rounded-geist shadow-[0_0_200px_rgba(0,0,0,0.15)] mb-10 mt-16">
          <Player
            component={Main}
            inputProps={inputProps}
            durationInFrames={DURATION_IN_FRAMES}
            fps={VIDEO_FPS}
            compositionHeight={VIDEO_HEIGHT}
            compositionWidth={VIDEO_WIDTH}
            style={{
              width: "100%",
            }}
            controls
            autoPlay
            loop
          />
        </div>
        <div className="flex flex-col gap-4 p-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-medium">Follower Count</span>
            <input
              type="number"
              value={followerCount}
              onChange={(e) => setFollowerCount(Number(e.target.value) || 0)}
              className="border rounded-md px-3 py-2 text-lg"
              min={1}
            />
          </label>
        </div>
        <Spacing />
        <Spacing />
      </div>
    </div>
  );
};

export default Home;
