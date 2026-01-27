import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/PublicSans";
import { LAYOUT, SPRING_CONFIGS, THEMES, TIMING } from "./constants";
import { CompositionProps, Follower, XTheme } from "../../types/constants";
import {
  calculateMaxAvatars,
  generateMilestones,
  getCelebrationFrame,
  getCurrentMilestone,
  sanitizeFollowerCount,
} from "./utils";
import { AvatarStack } from "./components/avatar-stack";
import { Celebration } from "./components/celebration";
import { TextLabel } from "./components/text-label";
import { z } from "zod";

// Load font on module initialization
loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

// Re-export types for external use
export type { Follower, XTheme } from "../../types/constants";
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
    [safeFollowerCount, width, fps, followers],
  );

  // Memoize timing calculations
  const { celebrationStart, fastStagger, springSettleTime } = useMemo(
    () => ({
      celebrationStart: getCelebrationFrame(milestones),
      fastStagger: Math.max(1, Math.round(TIMING.AVATAR_STAGGER_FAST * fps)),
      springSettleTime: Math.round(TIMING.SPRING_SETTLE * fps),
    }),
    [milestones, fps],
  );

  const currentMilestone = getCurrentMilestone(frame, milestones);

  // Container scale animation
  const containerScale = useMemo(() => {
    if (frame < celebrationStart) {
      return interpolate(
        frame,
        [0, Math.max(1, celebrationStart - 1)],
        [LAYOUT.ZOOM, 1.0],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
          easing: Easing.out(Easing.cubic),
        },
      );
    } else {
      const springBack = spring({
        frame: frame - celebrationStart,
        fps,
        config: SPRING_CONFIGS.heavy,
      });
      return interpolate(springBack, [0, 1], [1.0, LAYOUT.ZOOM]);
    }
  }, [frame, celebrationStart, fps]);

  // Calculate scroll timing
  const previousMilestoneAvatars =
    milestones[milestones.length - 2]?.totalAvatars || 0;
  const newAvatarsInCelebration = Math.max(
    0,
    currentMilestone.totalAvatars - previousMilestoneAvatars,
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
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
            easing: Easing.out(Easing.quad),
          },
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
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: LAYOUT.GRADIENT_WIDTH,
          background: `linear-gradient(to right, ${colors.gradient}, transparent)`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: LAYOUT.GRADIENT_WIDTH,
          background: `linear-gradient(to left, ${colors.gradient}, transparent)`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />

      <AbsoluteFill className="justify-center items-center">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily,
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
            count={currentMilestone.count}
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
