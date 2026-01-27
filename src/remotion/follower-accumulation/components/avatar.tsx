import React from "react";
import { spring, useCurrentFrame, useVideoConfig, Img } from "remotion";
import { AVATAR, AVATAR_COLORS, SPRING_CONFIGS, THEMES } from "../constants";
import { SCALE } from "@/constants/remotion";
import type { Follower, XTheme } from "../../../types/schemas";
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
    fps,
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
          position: "relative",
          flexShrink: 0,
          marginLeft: 0,
          zIndex: 100,
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
            backgroundColor: AVATAR.FIRST_COLOR,
          }}
        >
          <Img
            src={avatarUrl}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        </div>
      </div>
    );
  }

  // Animated avatars: spring animation with stagger
  const isCelebrationAvatar = appearFrame >= celebrationStart;
  const springConfig = isCelebrationAvatar
    ? { ...SPRING_CONFIGS.snappy, stiffness: 300 }
    : SPRING_CONFIGS.snappy;

  const scale = spring({ frame: animationFrame, fps, config: springConfig });
  const clampedScale = animationFrame < 0 ? 0 : Math.min(Math.max(0, scale), 1);

  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        marginLeft: -AVATAR.OVERLAP,
        zIndex: 100 - index,
        transform: `scale(${clampedScale})`,
        opacity: clampedScale,
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
          backgroundColor: isFirst ? AVATAR.FIRST_COLOR : avatarColor,
        }}
      >
        <Img
          src={avatarUrl}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};
