import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { LAYOUT, SPRING_CONFIGS, THEMES, TIMING } from "../constants";
import { SCALE } from "@/constants/remotion";
import type { XTheme } from "../../../types/schemas";
import type { Milestone } from "../types";
import { getCelebrationFrame } from "../utils";

export interface CelebrationProps {
  theme: XTheme;
  milestones: Milestone[];
}

/** Celebration text that slides up when reaching final milestone */
export const Celebration: React.FC<CelebrationProps> = ({
  theme,
  milestones,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = THEMES[theme];

  const celebrationStart = getCelebrationFrame(milestones);
  const fadeDuration = Math.round(TIMING.FADE_DURATION * fps);

  // Slide up animation with heavy spring for dramatic effect
  const slideProgress = spring({
    frame: Math.max(0, frame - celebrationStart),
    fps,
    config: SPRING_CONFIGS.heavy,
  });

  // Animate height from 0 to full height
  const height =
    frame < celebrationStart
      ? 0
      : interpolate(slideProgress, [0, 1], [0, LAYOUT.CELEBRATION_HEIGHT]);

  // Slide up from below (auto-scaled)
  const slideDistance = 30 * SCALE;
  const translateY =
    frame < celebrationStart
      ? slideDistance
      : interpolate(slideProgress, [0, 1], [slideDistance, 0]);

  // Fade in
  const opacity = interpolate(
    frame,
    [celebrationStart, celebrationStart + fadeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        height,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        marginBottom: height > 0 ? 16 * SCALE : 0,
      }}
    >
      <h1
        style={{
          fontSize: 60 * SCALE,
          fontWeight: 700,
          color: colors.text,
          whiteSpace: "nowrap",
          margin: 0,
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        Thank You!
      </h1>
    </div>
  );
};
