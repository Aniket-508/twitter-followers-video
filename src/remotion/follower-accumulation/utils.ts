import { AVATAR, LAYOUT, TIMING } from "./constants";
import type { Follower } from "../../types/constants";
import type { Milestone } from "./types";
import { random } from "remotion";

/**
 * Generates a safe URL for Dicebear avatar API.
 * Handles special characters in names by encoding them.
 */
export function getDicebearUrl(seed: string | number): string {
  const safeSeed = encodeURIComponent(String(seed));
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${safeSeed}`;
}

/**
 * Fisher-Yates shuffle algorithm to randomize an array.
 * Returns a new shuffled array without mutating the original.
 */
export function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(random(null) * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Validates and sanitizes follower count input.
 * Ensures the value is a positive integer >= 1.
 */
export function sanitizeFollowerCount(count: number): number {
  if (!Number.isFinite(count) || count < 1) {
    return 1;
  }
  return Math.floor(count);
}

/**
 * Calculate max avatars that fit in a given width.
 * First avatar takes full width, each additional takes (AVATAR.SIZE - AVATAR.OVERLAP).
 * Accounts for zoom effect (LAYOUT.ZOOM) which reduces visible area.
 */

export function calculateMaxAvatars(width: number): number {
  if (width <= 0) return 1;
  const visibleWidth = width / LAYOUT.ZOOM;
  const totalWidth = visibleWidth + LAYOUT.SCROLL_DISTANCE;
  const remaining = totalWidth - AVATAR.SIZE;
  const additionalAvatars = Math.floor(
    remaining / (AVATAR.SIZE - AVATAR.OVERLAP),
  );
  return Math.max(1, 1 + additionalAvatars);
}

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
export function generateMilestones(
  finalCount: number,
  frameWidth: number,
  fps: number,
  followers?: Follower[],
): Milestone[] {
  // Sanitize input
  const safeCount = sanitizeFollowerCount(finalCount);

  // Calculate max avatars with scroll distance
  const maxAvatarsWithScroll = calculateMaxAvatars(
    frameWidth + LAYOUT.SCROLL_DISTANCE,
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
    for (let i = 1; i < avatarCounts.length; i++) {
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

  for (let i = 0; i < 3; i++) {
    const avatarCount = avatarCounts[i];
    milestones.push({
      frame: currentFrame,
      name: names[i],
      count: Math.max(0, avatarCount - 1), // "X others" count
      totalAvatars: avatarCount,
    });
    currentFrame += intervalFrames;
  }

  // Final milestone (celebration)
  milestones.push({
    frame: currentFrame,
    name: names[3],
    count: Math.max(0, celebrationCount - 1),
    totalAvatars: celebrationCount,
  });

  return milestones;
}

/** Gets the celebration (final) frame from milestones array */
export function getCelebrationFrame(milestones: Milestone[]): number {
  if (milestones.length === 0) return 0;
  return milestones[milestones.length - 1].frame;
}

/** Gets the current milestone based on the current frame */
export function getCurrentMilestone(
  frame: number,
  milestones: Milestone[],
): Milestone {
  if (milestones.length === 0) {
    return { frame: 0, name: "User", count: 0, totalAvatars: 1 };
  }
  return (
    milestones
      .slice()
      .reverse()
      .find((m) => frame >= m.frame) || milestones[0]
  );
}

/** Gets the previous milestone for count animation transitions */
export function getPreviousMilestone(
  frame: number,
  milestones: Milestone[],
): Milestone | null {
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (frame >= milestones[i].frame) {
      return i > 0 ? milestones[i - 1] : null;
    }
  }
  return null;
}

/**
 * Calculate when each avatar should appear based on milestones.
 * During celebration, avatars appear faster in a continuous stream.
 */
export function getAvatarAppearFrame(
  index: number,
  milestones: Milestone[],
  celebrationStart: number,
  fps: number,
): number {
  if (index < 0 || milestones.length === 0) return 0;

  let previousAvatarCount = 0;
  const normalStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER * fps));
  const fastStagger = Math.max(1, Math.round(TIMING.AVATAR_STAGGER_FAST * fps));

  for (const milestone of milestones) {
    if (index < milestone.totalAvatars) {
      const positionInMilestone = Math.max(0, index - previousAvatarCount);

      // Celebration milestone: faster stagger
      if (milestone.frame >= celebrationStart) {
        return celebrationStart + positionInMilestone * fastStagger;
      }

      // Normal milestones
      return milestone.frame + positionInMilestone * normalStagger;
    }
    previousAvatarCount = milestone.totalAvatars;
  }
  return 0;
}
