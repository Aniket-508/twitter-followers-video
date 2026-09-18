import { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import { AvatarStack } from "@/remotion/templates/classic/components/avatar-stack";
import { Celebration } from "@/remotion/templates/classic/components/celebration";
import { TextLabel } from "@/remotion/templates/classic/components/text-label";
import {
  LAYOUT,
  SPRING_CONFIGS,
  THEMES,
  TIMING,
} from "@/remotion/templates/shared/constants";
import { VIDEO_FONT_FAMILY } from "@/remotion/templates/shared/font";
import type { FollowerTemplateProps } from "@/remotion/templates/shared/types";
import {
  calculateMaxAvatars,
  getCelebrationFrame,
  getCurrentMilestone,
} from "@/remotion/templates/shared/utils";

export const ClassicTemplate = ({
  followerCount,
  followers,
  milestones,
  theme,
}: FollowerTemplateProps) => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps, width } = useVideoConfig();
  const colors = THEMES[theme];

  const { celebrationStart, fastStagger, springSettleTime } = useMemo(
    () => ({
      celebrationStart: getCelebrationFrame(milestones),
      fastStagger: Math.max(1, Math.round(TIMING.AVATAR_STAGGER_FAST * fps)),
      springSettleTime: Math.round(TIMING.SPRING_SETTLE * fps),
    }),
    [milestones, fps]
  );

  const currentMilestone = getCurrentMilestone(frame, milestones);
  const containerScale =
    frame < celebrationStart
      ? interpolate(
          frame,
          [0, Math.max(1, celebrationStart - 1)],
          [LAYOUT.ZOOM, 1],
          {
            easing: Easing.out(Easing.cubic),
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          }
        )
      : interpolate(
          spring({
            config: SPRING_CONFIGS.heavy,
            fps,
            frame: frame - celebrationStart,
          }),
          [0, 1],
          [1, LAYOUT.ZOOM]
        );

  const previousMilestoneAvatars = milestones.at(-2)?.totalAvatars || 0;
  const newAvatarsInCelebration = Math.max(
    0,
    currentMilestone.totalAvatars - previousMilestoneAvatars
  );
  const lastAvatarAppearFrame =
    celebrationStart + newAvatarsInCelebration * fastStagger;
  const allAvatarsVisibleFrame = lastAvatarAppearFrame + springSettleTime;
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

  const maxNeeded = calculateMaxAvatars(width + LAYOUT.SCROLL_DISTANCE);
  const currentTotal = currentMilestone.totalAvatars;
  const fillerCount =
    frame >= allAvatarsVisibleFrame && currentTotal < maxNeeded
      ? maxNeeded - currentTotal + 2
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      <AbsoluteFill className="justify-center items-center">
        <div
          style={{
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
            fontFamily: VIDEO_FONT_FAMILY,
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
            finalCount={followerCount}
            milestones={milestones}
            theme={theme}
            followers={followers}
          />
        </div>
      </AbsoluteFill>

      <div
        style={{
          background: `linear-gradient(to right, ${colors.gradient}, transparent)`,
          bottom: 0,
          left: 0,
          pointerEvents: "none",
          position: "absolute",
          top: 0,
          width: LAYOUT.GRADIENT_WIDTH,
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
        }}
      />
    </AbsoluteFill>
  );
};
