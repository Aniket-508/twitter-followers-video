import React from "react";
import { Img } from "remotion";
import { AVATAR, AVATAR_COLORS, THEMES } from "../constants";
import { SCALE } from "@/constants/remotion";
import type { XTheme } from "../../../types/schemas";
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
        position: "relative",
        flexShrink: 0,
        marginLeft: -AVATAR.OVERLAP,
        zIndex: Math.max(1, 100 - index),
      }}
    >
      <div
        style={{
          width: AVATAR.SIZE,
          height: AVATAR.SIZE,
          borderRadius: "50%",
          border: `${2 * SCALE}px solid ${colors.avatarBorder}`,
          overflow: "hidden",
          boxShadow: colors.shadow,
          backgroundColor: avatarColor,
        }}
      >
        <Img
          src={getDicebearUrl(`filler-${index}`)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
