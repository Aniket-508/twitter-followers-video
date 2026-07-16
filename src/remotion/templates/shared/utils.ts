import { interpolate, random } from "remotion";

import type { Follower } from "../../../types/schema";
import { AVATAR, LAYOUT, TIMING } from "./constants";
import type { Milestone } from "./types";

interface AnimatedFollowerCountParams {
  finalCount: number;
  fps: number;
  frame: number;
  milestones: Milestone[];
}

/**
 * Generates a safe URL for Dicebear avatar API.
 * Handles special characters in names by encoding them.
 */
export const getDicebearUrl = (seed: string | number): string => {
  const safeSeed = encodeURIComponent(String(seed));
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeSeed}`;
};

/**
 * Fisher-Yates shuffle algorithm to randomize an array.
 * Returns a new shuffled array without mutating the original.
 */
export const shuffle = <T>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random(null) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

/**
 * Validates and sanitizes follower count input.
 * Ensures the value is a positive integer >= 1.
 */
export const sanitizeFollowerCount = (count: number): number => {
  if (!Number.isFinite(count) || count < 1) {
    return 1;
  }
  return Math.floor(count);
};

/**
 * Calculate max avatars that fit in a given width.
 * First avatar takes full width, each additional takes (AVATAR.SIZE - AVATAR.OVERLAP).
 * Accounts for zoom effect (LAYOUT.ZOOM) which reduces visible area.
 */

export const calculateMaxAvatars = (width: number): number => {
  if (width <= 0) {
    return 1;
  }
  const visibleWidth = width / LAYOUT.ZOOM;
  const totalWidth = visibleWidth + LAYOUT.SCROLL_DISTANCE;
  const remaining = totalWidth - AVATAR.SIZE;
  const additionalAvatars = Math.floor(
    remaining / (AVATAR.SIZE - AVATAR.OVERLAP)
  );
  return Math.max(1, 1 + additionalAvatars);
};

/**
 * Generates milestone configuration for the animation.
 * Always creates exactly 3 milestones + celebration.
 *
 * @param finalCount - Total number of followers to display
 * @param frameWidth - Width of the video frame in pixels
 * @param fps - Frames per second of the video
 * @param followers - Optional array of follower data for names
 * @returns Array of milestone objects defining animation keyframes
 */
export const generateMilestones = (
  finalCount: number,
  frameWidth: number,
  fps: number,
  followers?: Follower[]
): Milestone[] => {
  // Sanitize input
  const safeCount = sanitizeFollowerCount(finalCount);

  // Calculate max avatars with scroll distance
  const maxAvatarsWithScroll = calculateMaxAvatars(
    frameWidth + LAYOUT.SCROLL_DISTANCE
  );

  // Determine the final visual target count (clamped by available space)
  const celebrationCount = Math.min(safeCount, maxAvatarsWithScroll);

  // Names for milestones (use follower names if available)
  const defaultNames = ["John", "Alex", "Sarah", "Cheers"];
  const names =
    followers && followers.length >= 4
      ? followers
          .slice(0, 4)
          .map((f) => f.name || defaultNames[followers.indexOf(f)] || "User")
      : defaultNames;

  // Calculate avatar counts for each milestone
  // For very small counts (1-3), handle specially to avoid duplicates
  let avatarCounts: number[];
  if (celebrationCount <= 1) {
    avatarCounts = [1, 1, 1];
  } else if (celebrationCount === 2) {
    avatarCounts = [1, 1, 2];
  } else if (celebrationCount === 3) {
    avatarCounts = [1, 2, 3];
  } else {
    // Normal case: progressive increase
    avatarCounts = [
      Math.max(1, Math.floor(celebrationCount * 0.25)),
      Math.max(2, Math.floor(celebrationCount * 0.5)),
      Math.max(3, Math.floor(celebrationCount * 0.75)),
    ];
    // Ensure strict monotonicity
    for (let i = 1; i < avatarCounts.length; i += 1) {
      if (avatarCounts[i] <= avatarCounts[i - 1]) {
        avatarCounts[i] = avatarCounts[i - 1] + 1;
      }
    }
    // Clamp to celebration count
    avatarCounts = avatarCounts.map((c) => Math.min(c, celebrationCount - 1));
  }

  // Build milestones
  const milestones: Milestone[] = [];
  let currentFrame = Math.round(TIMING.START_DELAY * fps);
  const intervalFrames = Math.round(TIMING.MILESTONE_INTERVAL * fps);

  for (let i = 0; i < 3; i += 1) {
    const avatarCount = avatarCounts[i];
    milestones.push({
      // "X others" count
      count: Math.max(0, avatarCount - 1),
      frame: currentFrame,
      name: names[i],
      totalAvatars: avatarCount,
    });
    currentFrame += intervalFrames;
  }

  // Final milestone (celebration)
  milestones.push({
    count: Math.max(0, celebrationCount - 1),
    frame: currentFrame,
    name: names[3],
    totalAvatars: celebrationCount,
  });

  return milestones;
};

/** Gets the celebration (final) frame from milestones array */
export const getCelebrationFrame = (milestones: Milestone[]): number => {
  if (milestones.length === 0) {
    return 0;
  }
  return milestones.at(-1)?.frame ?? 0;
};

/** Gets the current milestone based on the current frame */
export const getCurrentMilestone = (
  frame: number,
  milestones: Milestone[]
): Milestone => {
  if (milestones.length === 0) {
    return { count: 0, frame: 0, name: "User", totalAvatars: 1 };
  }
  return (
    [...milestones].toReversed().find((m) => frame >= m.frame) || milestones[0]
  );
};

/** Animates the headline count through each milestone and into the true total. */
export const getAnimatedFollowerCount = ({
  finalCount,
  fps,
  frame,
  milestones,
}: AnimatedFollowerCountParams): number => {
  if (milestones.length === 0) {
    return sanitizeFollowerCount(finalCount);
  }

  const currentIndex = milestones.findLastIndex(
    (milestone) => frame >= milestone.frame
  );
  if (currentIndex === -1) {
    return 0;
  }

  const currentMilestone = milestones[currentIndex];
  const previousMilestone = milestones[currentIndex - 1];
  const isFinalMilestone = currentIndex === milestones.length - 1;
  const startCount = previousMilestone?.totalAvatars ?? 0;
  const targetCount = isFinalMilestone
    ? sanitizeFollowerCount(finalCount)
    : currentMilestone.totalAvatars;
  const duration = Math.round((isFinalMilestone ? 1.25 : 0.55) * fps);

  return Math.round(
    interpolate(
      frame,
      [currentMilestone.frame, currentMilestone.frame + duration],
      [startCount, targetCount],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
      }
    )
  );
};

/** Gets the previous milestone for count animation transitions */
export const getPreviousMilestone = (
  frame: number,
  milestones: Milestone[]
): Milestone | null => {
  for (let i = milestones.length - 1; i >= 0; i -= 1) {
    if (frame >= milestones[i].frame) {
      return i > 0 ? milestones[i - 1] : null;
    }
  }
  return null;
};

/**
 * Calculate when each avatar should appear based on milestones.
 * During celebration, avatars appear faster in a continuous stream.
 */
export const getAvatarAppearFrame = (
  index: number,
  milestones: Milestone[],
  celebrationStart: number,
  fps: number
): number => {
  if (index < 0 || milestones.length === 0) {
    return 0;
  }

  let previousAvatarCount = 0;
  const normalStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER * fps));
  const fastStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER_FAST * fps));

  for (const milestone of milestones) {
    if (index < milestone.totalAvatars) {
      const positionInMilestone = Math.max(0, index - previousAvatarCount);

      if (milestone.frame >= celebrationStart) {
        return celebrationStart + positionInMilestone * fastStagger;
      }

      return milestone.frame + positionInMilestone * normalStagger;
    }
    previousAvatarCount = milestone.totalAvatars;
  }
  return 0;
};
