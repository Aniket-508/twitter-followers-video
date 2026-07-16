import {
  Img,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { Follower } from "../../../types/schema";
import { VIDEO_FONT_FAMILY } from "./font";
import { getDicebearUrl } from "./utils";

interface TemplateAvatarProps {
  accent: string;
  appearFrame: number;
  borderColor: string;
  follower?: Follower;
  index: number;
  labelColor: string;
  shadow: string;
  showLabel?: boolean;
  size: number;
}

export const TemplateAvatar = ({
  accent,
  appearFrame,
  borderColor,
  follower,
  index,
  labelColor,
  shadow,
  showLabel = false,
  size,
}: TemplateAvatarProps) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const entrance = spring({
    config: { damping: 18, stiffness: 180 },
    durationInFrames: Math.round(0.55 * fps),
    fps,
    frame: frame - appearFrame,
  });
  const progress = frame < appearFrame ? 0 : Math.min(1, entrance);
  const scale = interpolate(progress, [0, 1], [0.88, 1]);
  const avatarUrl = follower?.image || getDicebearUrl(follower?.name || index);

  return (
    <div
      style={{
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
        fontFamily: VIDEO_FONT_FAMILY,
        opacity: progress,
        transform: `scale(${scale})`,
      }}
    >
      <div
        style={{
          background: borderColor,
          border: `2px solid ${accent}`,
          borderRadius: "50%",
          boxShadow: shadow,
          height: size,
          overflow: "hidden",
          padding: Math.max(4, size * 0.055),
          width: size,
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
      {showLabel ? (
        <div
          style={{
            color: labelColor,
            fontSize: Math.max(20, size * 0.2),
            fontWeight: 700,
            marginTop: 10,
            maxWidth: size * 2.4,
            overflow: "hidden",
            textOverflow: "ellipsis",
            textShadow: "0 2px 12px rgba(0,0,0,0.35)",
            whiteSpace: "nowrap",
          }}
        >
          {follower?.name || "New follower"}
        </div>
      ) : null}
    </div>
  );
};
