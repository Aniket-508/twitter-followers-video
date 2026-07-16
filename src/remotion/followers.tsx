import type { ComponentType } from "react";
import { useMemo } from "react";
import { useVideoConfig } from "remotion";
import type { z } from "zod";

import type { CompositionProps, VideoTemplate } from "../types/schema";
import { ClassicTemplate } from "./templates/classic/classic-template";
import { ConstellationTemplate } from "./templates/constellation/constellation-template";
import { OrbitTemplate } from "./templates/orbit/orbit-template";
import type { FollowerTemplateProps } from "./templates/shared/types";
import {
  generateMilestones,
  sanitizeFollowerCount,
} from "./templates/shared/utils";

// Re-export types for external use
export type { Follower, VideoTemplate, XTheme } from "../types/schema";
export type { Milestone, ThemeColors } from "./templates/shared/types";

export type FollowersProps = z.infer<typeof CompositionProps>;

const TEMPLATE_COMPONENTS = {
  classic: ClassicTemplate,
  constellation: ConstellationTemplate,
  orbit: OrbitTemplate,
} satisfies Record<VideoTemplate, ComponentType<FollowerTemplateProps>>;

/**
 * Main followers video composition.
 * Displays animated avatars with milestone-based reveals and celebration finale.
 */
export const Followers = ({
  followerCount,
  followers,
  template = "classic",
  theme = "light",
}: z.infer<typeof CompositionProps>) => {
  const { fps, width } = useVideoConfig();
  const safeFollowerCount = sanitizeFollowerCount(followerCount);
  const milestones = useMemo(
    () => generateMilestones(safeFollowerCount, width, fps, followers),
    [safeFollowerCount, width, fps, followers]
  );
  const SelectedTemplate = TEMPLATE_COMPONENTS[template];

  return (
    <SelectedTemplate
      followerCount={safeFollowerCount}
      followers={followers}
      milestones={milestones}
      theme={theme}
    />
  );
};
