import { loadFont, fontFamily } from "@remotion/google-fonts/PublicSans";
import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import type { z } from "zod";

import type { CompositionProps, Follower, XTheme } from "../../types/schema";
import { AvatarStack } from "./components/avatar-stack";
import { Celebration } from "./components/celebration";
import { TextLabel } from "./components/text-label";
import { LAYOUT, SPRING_CONFIGS, THEMES, TIMING } from "./constants";
import {
  calculateMaxAvatars,
  generateMilestones,
  getCelebrationFrame,
  getCurrentMilestone,
  sanitizeFollowerCount,
} from "./utils";

// Load font on module initialization
loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

// Re-export types for external use
export type { Follower, XTheme } from "../../types/schema";
export type { Milestone, ThemeColors } from "./types";

export interface FollowerAccumulationProps {
  followerCount: number;
  theme?: XTheme;
  followers?: Follower[];
}

/**
 * Main follower accumulation animation component.
 * Displays animated avatars with milestone-based reveals and celebration finale.
 */
export const FollowerAccumulation = ({
  followerCount,
  theme = "light",
  followers,
}: z.infer<typeof CompositionProps>) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const colors = THEMES[theme];

  // Sanitize input
  const safeFollowerCount = sanitizeFollowerCount(followerCount);

  // Memoize milestones
  const milestones = useMemo(
    () => generateMilestones(safeFollowerCount, width, fps, followers),
    [safeFollowerCount, width, fps, followers]
  );

  // Memoize timing calculations
  const { celebrationStart, fastStagger, springSettleTime } = useMemo(
    () => ({
      celebrationStart: getCelebrationFrame(milestones),
      fastStagger: Math.max(1, Math.round(TIMING.AVATAR_STAGGER_FAST * fps)),
      springSettleTime: Math.round(TIMING.SPRING_SETTLE * fps),
    }),
    [milestones, fps]
  );

  const currentMilestone = getCurrentMilestone(frame, milestones);

  // Container scale animation
  const containerScale = useMemo(() => {
    if (frame < celebrationStart) {
      return interpolate(
        frame,
        [0, Math.max(1, celebrationStart - 1)],
        [LAYOUT.ZOOM, 1],
        {
          easing: Easing.out(Easing.cubic),
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      );
    }
    const springBack = spring({
      config: SPRING_CONFIGS.heavy,
      fps,
      frame: frame - celebrationStart,
    });
    return interpolate(springBack, [0, 1], [1, LAYOUT.ZOOM]);
  }, [frame, celebrationStart, fps]);

  // Calculate scroll timing
  const previousMilestoneAvatars = milestones.at(-2)?.totalAvatars || 0;
  const newAvatarsInCelebration = Math.max(
    0,
    currentMilestone.totalAvatars - previousMilestoneAvatars
  );
  const lastAvatarAppearFrame =
    celebrationStart + newAvatarsInCelebration * fastStagger;
  const allAvatarsVisibleFrame = lastAvatarAppearFrame + springSettleTime;

  // Marquee scroll offset
  const marqueeOffset =
    frame >= allAvatarsVisibleFrame
      ? interpolate(
          frame,
          [allAvatarsVisibleFrame, durationInFrames],
          [0, -LAYOUT.SCROLL_DISTANCE],
          {
            easing: Easing.out(Easing.quad),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : 0;

  // Calculate filler avatars needed
  const maxNeeded = calculateMaxAvatars(width + LAYOUT.SCROLL_DISTANCE);
  const currentTotal = currentMilestone.totalAvatars;
  const fillerCount =
    frame >= allAvatarsVisibleFrame && currentTotal < maxNeeded
      ? maxNeeded - currentTotal + 2
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Edge fade gradients */}
      <div
        style={{
          background: `linear-gradient(to right, ${colors.gradient}, transparent)`,
          bottom: 0,
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          width: LAYOUT.GRADIENT_WIDTH,
          zIndex: 10,
        }}
      />
      <div
        style={{
          background: `linear-gradient(to left, ${colors.gradient}, transparent)`,
          bottom: 0,
          pointerEvents: "none",
          position: "absolute",
          right: 0,
          top: 0,
          width: LAYOUT.GRADIENT_WIDTH,
          zIndex: 10,
        }}
      />

      <AbsoluteFill className="justify-center items-center">
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            fontFamily,
            position: "relative",
            transform: `scale(${containerScale})`,
          }}
        >
          <Celebration theme={theme} milestones={milestones} />
          <AvatarStack
            limit={currentMilestone.totalAvatars}
            marqueeOffset={marqueeOffset}
            milestones={milestones}
            celebrationStart={celebrationStart}
            fillerCount={fillerCount}
            theme={theme}
            followers={followers}
          />
          <TextLabel
            name={currentMilestone.name}
            finalCount={safeFollowerCount}
            milestones={milestones}
            theme={theme}
            followers={followers}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
