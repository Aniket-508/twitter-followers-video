import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Img } from "remotion";

import type { Follower, XTheme } from "../../../types/schema";
import { AVATAR, AVATAR_COLORS, SPRING_CONFIGS, THEMES } from "../constants";
import type { Milestone } from "../types";
import { getDicebearUrl, getAvatarAppearFrame } from "../utils";

export interface AvatarProps {
  index: number;
  isFirst: boolean;
  milestones: Milestone[];
  celebrationStart: number;
  theme: XTheme;
  follower?: Follower;
}

/**
 * Avatar component with spring animation.
 * First avatar appears immediately, others animate in with stagger.
 */
export const Avatar: React.FC<AvatarProps> = ({
  index,
  isFirst,
  milestones,
  celebrationStart,
  theme,
  follower,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = THEMES[theme];

  const appearFrame = getAvatarAppearFrame(
    index,
    milestones,
    celebrationStart,
    fps
  );
  const animationFrame = frame - appearFrame;
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  // Use Dicebear as primary source (reliable, no CORS issues during render)
  // Fall back to provided image URL only if it exists
  const avatarUrl = follower?.image || getDicebearUrl(follower?.name || index);

  // First avatar: visible immediately (no animation)
  if (index === 0) {
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
              backgroundColor: AVATAR.FIRST_COLOR,
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
              src={avatarUrl}
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
  }

  // Animated avatars: spring animation with stagger
  const isCelebrationAvatar = appearFrame >= celebrationStart;
  const springConfig = isCelebrationAvatar
    ? { ...SPRING_CONFIGS.snappy, stiffness: 300 }
    : SPRING_CONFIGS.snappy;

  const scale = spring({ config: springConfig, fps, frame: animationFrame });
  const clampedScale = animationFrame < 0 ? 0 : Math.min(Math.max(0, scale), 1);

  return (
    <div
      style={{
        height: AVATAR.SIZE,
        opacity: clampedScale,
        position: "relative",
        transform: `scale(${clampedScale})`,
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
            backgroundColor: isFirst ? AVATAR.FIRST_COLOR : avatarColor,
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
            src={avatarUrl}
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
