import React, { useMemo } from "react";

import { Avatar } from "@/remotion/templates/classic/components/avatar";
import { FillerAvatar } from "@/remotion/templates/classic/components/filler-avatar";
import { AVATAR } from "@/remotion/templates/shared/constants";
import type { Milestone } from "@/remotion/templates/shared/types";
import type { Follower, XTheme } from "@/types/schema";

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
    [limit]
  );

  const fillerIndices = useMemo(
    () =>
      fillerCount > 0
        ? Array.from({ length: fillerCount }, (_, i) => limit + i)
        : [],
    [fillerCount, limit]
  );

  const items = useMemo(
    () => [
      ...avatarIndices.map((index) => ({ index, type: "avatar" as const })),
      ...fillerIndices.map((index) => ({ index, type: "filler" as const })),
    ],
    [avatarIndices, fillerIndices]
  );
  const paintOrderedItems = useMemo(() => items.toReversed(), [items]);
  const stackWidth =
    items.length === 0
      ? 0
      : AVATAR.SIZE + (items.length - 1) * (AVATAR.SIZE - AVATAR.OVERLAP);

  return (
    <div
      style={{
        height: AVATAR.SIZE,
        position: "relative",
        transform: `translateX(${marqueeOffset}px)`,
        width: stackWidth,
      }}
    >
      {paintOrderedItems.map((item) => (
        <div
          key={`${item.type}-${item.index}`}
          style={{
            left: item.index * (AVATAR.SIZE - AVATAR.OVERLAP),
            position: "absolute",
            top: 0,
          }}
        >
          {item.type === "avatar" ? (
            <Avatar
              index={item.index}
              isFirst={item.index === 0}
              milestones={milestones}
              celebrationStart={celebrationStart}
              theme={theme}
              follower={followers?.[item.index]}
            />
          ) : (
            <FillerAvatar index={item.index} theme={theme} />
          )}
        </div>
      ))}
    </div>
  );
};
