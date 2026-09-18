import React from "react";
import { Img } from "remotion";

import {
  AVATAR,
  AVATAR_COLORS,
  THEMES,
} from "@/remotion/templates/shared/constants";
import { getDicebearUrl } from "@/remotion/templates/shared/utils";
import type { XTheme } from "@/types/schema";

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
        height: AVATAR.SIZE,
        position: "relative",
        width: AVATAR.SIZE,
      }}
    >
      <div
        style={{
          backgroundColor: colors.avatarBorder,
          borderRadius: "50%",
          boxShadow: colors.shadow,
          height: AVATAR.SIZE,
          position: "relative",
          width: AVATAR.SIZE,
        }}
      >
        <div
          style={{
            backgroundColor: avatarColor,
            borderRadius: "50%",
            bottom: AVATAR.BORDER_WIDTH,
            left: AVATAR.BORDER_WIDTH,
            overflow: "hidden",
            position: "absolute",
            right: AVATAR.BORDER_WIDTH,
            top: AVATAR.BORDER_WIDTH,
          }}
        >
          <Img
            src={getDicebearUrl(`filler-${index}`)}
            style={{
              borderRadius: "50%",
              height: "100%",
              objectFit: "cover",
              width: "100%",
            }}
          />
        </div>
      </div>
    </div>
  );
};
