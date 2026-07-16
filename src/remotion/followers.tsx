import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { z } from "zod";

import type { CompositionProps } from "../types/schema";
import { ClassicTemplate } from "./templates/classic/classic-template";
import {
  generateMilestones,
  sanitizeFollowerCount,
} from "./templates/shared/utils";

// Re-export types for external use
export type { Follower, XTheme } from "../types/schema";
export type { Milestone, ThemeColors } from "./templates/shared/types";

export type FollowersProps = z.infer<typeof CompositionProps>;

/**
 * Main followers video composition.
 * Displays animated avatars with milestone-based reveals and celebration finale.
 */
export const Followers = ({
  followerCount,
  followers,
  theme = "light",
}: z.infer<typeof CompositionProps>) => {
  const { fps, width } = useVideoConfig();
  const safeFollowerCount = sanitizeFollowerCount(followerCount);
  const milestones = useMemo(
    () => generateMilestones(safeFollowerCount, width, fps, followers),
    [safeFollowerCount, width, fps, followers]
  );
  return (
    <ClassicTemplate
      followerCount={safeFollowerCount}
      followers={followers}
      milestones={milestones}
      theme={theme}
    />
  );
};
