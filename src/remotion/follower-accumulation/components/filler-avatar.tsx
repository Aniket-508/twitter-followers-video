import React from "react";
import { Img } from "remotion";

import { SCALE } from "@/constants/remotion";

import type { XTheme } from "../../../types/schema";
import { AVATAR, AVATAR_COLORS, THEMES } from "../constants";
import { getDicebearUrl } from "../utils";

export interface FillerAvatarProps {
  index: number;
  theme: XTheme;
}

/** Filler avatar component - static avatars to fill empty space during scroll */
export const FillerAvatar: React.FC<FillerAvatarProps> = ({ index, theme }) => {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const colors = THEMES[theme];

  return (
    <div
      style={{
        flexShrink: 0,
        marginLeft: -AVATAR.OVERLAP,
        position: "relative",
        zIndex: Math.max(1, 100 - index),
      }}
    >
      <div
        style={{
          backgroundColor: avatarColor,
          border: `${2 * SCALE}px solid ${colors.avatarBorder}`,
          borderRadius: "50%",
          boxShadow: colors.shadow,
          height: AVATAR.SIZE,
          overflow: "hidden",
          width: AVATAR.SIZE,
        }}
      >
        <Img
          src={getDicebearUrl(`filler-${index}`)}
          style={{ height: "100%", objectFit: "cover", width: "100%" }}
        />
      </div>
    </div>
  );
};
