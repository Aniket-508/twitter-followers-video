import React, { useMemo } from "react";
import type { Follower, XTheme } from "../../../types/schemas";
import type { Milestone } from "../types";
import { Avatar } from "./avatar";
import { FillerAvatar } from "./filler-avatar";

export interface AvatarStackProps {
  limit: number;
  marqueeOffset: number;
  milestones: Milestone[];
  celebrationStart: number;
  fillerCount: number;
  theme: XTheme;
  followers?: Follower[];
}

/** Container for animated avatar stack with optional filler avatars */
export const AvatarStack: React.FC<AvatarStackProps> = ({
  limit,
  marqueeOffset,
  milestones,
  celebrationStart,
  fillerCount,
  theme,
  followers,
}) => {
  // Memoize avatar indices to avoid array creation every frame
  const avatarIndices = useMemo(
    () => Array.from({ length: Math.max(0, limit) }, (_, i) => i),
    [limit],
  );

  const fillerIndices = useMemo(
    () =>
      fillerCount > 0
        ? Array.from({ length: fillerCount }, (_, i) => limit + i)
        : [],
    [fillerCount, limit],
  );

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        transform: `translateX(${marqueeOffset}px)`,
        width: "max-content",
      }}
    >
      {avatarIndices.map((index) => (
        <Avatar
          key={index}
          index={index}
          isFirst={index === 0}
          milestones={milestones}
          celebrationStart={celebrationStart}
          theme={theme}
          follower={followers?.[index]}
        />
      ))}
      {fillerIndices.map((index) => (
        <FillerAvatar key={`filler-${index}`} index={index} theme={theme} />
      ))}
    </div>
  );
};
