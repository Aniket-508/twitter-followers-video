import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";

import { SCALE } from "@/constants/remotion";
import { VerifiedBadge } from "@/remotion/templates/classic/components/verified-badge";
import { THEMES, TIMING } from "@/remotion/templates/shared/constants";
import type { Milestone } from "@/remotion/templates/shared/types";
import {
  getCelebrationFrame,
  getCurrentMilestone,
  getPreviousMilestone,
} from "@/remotion/templates/shared/utils";
import type { Follower, XTheme } from "@/types/schema";

export interface TextLabelProps {
  name: string;
  finalCount: number;
  milestones: Milestone[];
  theme: XTheme;
  followers?: Follower[];
}

interface DisplayCountParams {
  celebrationFrame: number;
  currentMilestone: Milestone;
  finalCount: number;
  fps: number;
  frame: number;
  previousMilestone: Milestone | null;
}

const getDisplayCount = ({
  celebrationFrame,
  currentMilestone,
  finalCount,
  fps,
  frame,
  previousMilestone,
}: DisplayCountParams) => {
  if (frame < currentMilestone.frame) {
    return 0;
  }

  const normalStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER * fps));
  const fastStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER_FAST * fps));
  const springDelay = Math.round(TIMING.SPRING_DELAY * fps);
  const previousAvatars = previousMilestone?.totalAvatars ?? 1;
  const isFinalMilestone = currentMilestone.frame === celebrationFrame;
  const newAvatars = Math.max(
    0,
    currentMilestone.totalAvatars - previousAvatars
  );

  if (newAvatars === 0) {
    return Math.max(0, currentMilestone.totalAvatars - 1);
  }

  const staggerTime = isFinalMilestone ? fastStagger : normalStagger;
  const animationDuration = Math.max(1, newAvatars * staggerTime);
  const delayedStart = currentMilestone.frame + springDelay;
  const targetCount = isFinalMilestone
    ? Math.max(0, finalCount - 1)
    : Math.max(0, currentMilestone.totalAvatars - 1);
  const startCount = previousMilestone
    ? Math.max(0, previousMilestone.totalAvatars - 1)
    : 0;

  return Math.round(
    interpolate(
      frame,
      [delayedStart, delayedStart + animationDuration],
      [startCount, targetCount],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );
};

/** Text label showing "[Name] and X others followed you" */
export const TextLabel: React.FC<TextLabelProps> = ({
  name,
  finalCount,
  milestones,
  theme,
  followers,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = THEMES[theme];

  const currentMilestone = getCurrentMilestone(frame, milestones);
  const previousMilestone = getPreviousMilestone(frame, milestones);

  const celebrationFrame = getCelebrationFrame(milestones);
  const rawDisplayCount = getDisplayCount({
    celebrationFrame,
    currentMilestone,
    finalCount,
    fps,
    frame,
    previousMilestone,
  });
  const displayCount = Math.max(0, rawDisplayCount);

  const formattedCount =
    displayCount >= 1000
      ? displayCount.toLocaleString()
      : displayCount.toString();

  // Safe access to followers array with bounds checking
  const displayIndex = Math.min(displayCount, (followers?.length ?? 1) - 1);
  const currentFollower = followers?.[Math.max(0, displayIndex)];
  const displayName = currentFollower?.name || name;
  const isVerified = currentFollower?.verified ?? false;

  const fontSize = 24 * SCALE;
  const marginSmall = 4 * SCALE;
  const marginMedium = 8 * SCALE;

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        marginTop: 10 * SCALE,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ color: colors.text, fontSize, fontWeight: 600 }}>
        {displayName}
      </span>
      {isVerified && (
        <span style={{ display: "inline-flex", marginLeft: marginSmall }}>
          <VerifiedBadge size={fontSize} />
        </span>
      )}
      {displayCount > 0 ? (
        <span
          style={{
            color: colors.textSecondary,
            fontSize,
            marginLeft: marginMedium,
          }}
        >
          and{" "}
          <span style={{ color: colors.text, fontWeight: 600 }}>
            {formattedCount}
          </span>{" "}
          others followed you
        </span>
      ) : (
        <span
          style={{
            color: colors.textSecondary,
            fontSize,
            marginLeft: marginMedium,
          }}
        >
          followed you
        </span>
      )}
    </div>
  );
};
