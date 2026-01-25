import React from "react";
import { interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { THEMES, TIMING } from "../constants";
import type { Follower, XTheme } from "../../../types/constants";
import type { Milestone } from "../types";
import { getCelebrationFrame, getCurrentMilestone, getPreviousMilestone } from "../utils";
import { VerifiedBadge } from "./verified-badge";

export interface TextLabelProps {
  name: string;
  count: number;
  finalCount: number;
  milestones: Milestone[];
  theme: XTheme;
  followers?: Follower[];
}

/** Text label showing "[Name] and X others followed you" */
export const TextLabel: React.FC<TextLabelProps> = ({
  name,
  count,
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
  const normalStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER * fps));
  const fastStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER_FAST * fps));
  const springDelay = Math.round(TIMING.SPRING_DELAY * fps);

  // Default to 0 if before first milestone
  const firstMilestoneFrame = milestones[0]?.frame ?? 0;
  let displayCount = frame < firstMilestoneFrame ? 0 : count;

  // Animate count for ALL milestones, matching avatar appearance speed
  if (currentMilestone && frame >= currentMilestone.frame) {
    const milestoneStart = currentMilestone.frame;
    const previousAvatars = previousMilestone?.totalAvatars ?? 1;
    const isFinalMilestone = currentMilestone.frame === celebrationFrame;

    // Calculate animation duration
    const newAvatars = Math.max(0, currentMilestone.totalAvatars - previousAvatars);
    const staggerTime = isFinalMilestone ? fastStagger : normalStagger;
    const animationDuration = Math.max(1, newAvatars * staggerTime);

    if (newAvatars === 0) {
      displayCount = Math.max(0, currentMilestone.totalAvatars - 1);
    } else {
      const delayedStart = milestoneStart + springDelay;
      const targetCount = isFinalMilestone
        ? Math.max(0, finalCount - 1)
        : Math.max(0, currentMilestone.totalAvatars - 1);
      const startCount = previousMilestone ? Math.max(0, previousMilestone.totalAvatars - 1) : 0;

      displayCount = Math.round(
        interpolate(frame, [delayedStart, delayedStart + animationDuration], [startCount, targetCount], {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        })
      );
    }
  }

  // Ensure displayCount is within bounds
  displayCount = Math.max(0, displayCount);

  const formattedCount = displayCount >= 1000 ? displayCount.toLocaleString() : displayCount.toString();

  // Safe access to followers array with bounds checking
  const displayIndex = Math.min(displayCount, (followers?.length ?? 1) - 1);
  const currentFollower = followers?.[Math.max(0, displayIndex)];
  const displayName = currentFollower?.name || name;
  const isVerified = currentFollower?.verified ?? false;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 20,
        whiteSpace: "nowrap",
      }}
    >
      <span style={{ fontSize: 24, fontWeight: 600, color: colors.text }}>{displayName}</span>
      {isVerified && (
        <span style={{ marginLeft: 4, display: "inline-flex" }}>
          <VerifiedBadge size={24} />
        </span>
      )}
      {displayCount > 0 ? (
        <span style={{ fontSize: 24, color: colors.textSecondary, marginLeft: 8 }}>
          and <span style={{ fontWeight: 600, color: colors.text }}>{formattedCount}</span> others followed you
        </span>
      ) : (
        <span style={{ fontSize: 24, color: colors.textSecondary, marginLeft: 8 }}>followed you</span>
      )}
    </div>
  );
};
