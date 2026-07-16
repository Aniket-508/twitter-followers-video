import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";

import type { XTheme } from "../../../types/schema";
import { VIDEO_FONT_FAMILY } from "../shared/font";
import { TemplateAvatar } from "../shared/template-avatar";
import type { FollowerTemplateProps } from "../shared/types";
import {
  getAnimatedFollowerCount,
  getAvatarAppearFrame,
  getCelebrationFrame,
  getCurrentMilestone,
} from "../shared/utils";

interface OrbitPalette {
  accent: string;
  avatarSurface: string;
  background: string;
  line: string;
  muted: string;
  secondary: string;
  surface: string;
  text: string;
}

const PALETTES: Record<XTheme, OrbitPalette> = {
  dim: {
    accent: "#fb7185",
    avatarSurface: "#1c1917",
    background:
      "radial-gradient(circle at 50% 50%, #4c1d95 0, #1e1b4b 42%, #0f172a 100%)",
    line: "#c4b5fd",
    muted: "#ddd6fe",
    secondary: "#fbbf24",
    surface: "rgba(15, 23, 42, 0.86)",
    text: "#fff7ed",
  },
  light: {
    accent: "#e11d48",
    avatarSurface: "#fff7ed",
    background:
      "radial-gradient(circle at 50% 50%, #fef3c7 0, #ffe4e6 42%, #ede9fe 100%)",
    line: "#7c3aed",
    muted: "#6b21a8",
    secondary: "#f59e0b",
    surface: "rgba(255, 255, 255, 0.86)",
    text: "#2e1065",
  },
  lightsOut: {
    accent: "#fb7185",
    avatarSurface: "#18181b",
    background:
      "radial-gradient(circle at 50% 50%, #3b0764 0, #09090b 48%, #000000 100%)",
    line: "#a78bfa",
    muted: "#d8b4fe",
    secondary: "#fbbf24",
    surface: "rgba(9, 9, 11, 0.88)",
    text: "#fafafa",
  },
};

const ORBIT_NODES = Array.from({ length: 18 }, (_, index) => ({
  angle: ((index * 137.5 + (index % 3) * 31) * Math.PI) / 180,
  ring: index % 3,
}));

const RING_SPEEDS = [0.08, -0.055, 0.035] as const;

export const OrbitTemplate = ({
  followerCount,
  followers,
  milestones,
  theme,
}: FollowerTemplateProps) => {
  const frame = useCurrentFrame();
  const { fps, height, width } = useVideoConfig();
  const palette = PALETTES[theme];
  const currentMilestone = getCurrentMilestone(frame, milestones);
  const celebrationFrame = getCelebrationFrame(milestones);
  const visibleNodes = Math.min(
    currentMilestone.totalAvatars,
    ORBIT_NODES.length
  );
  const displayCount = getAnimatedFollowerCount({
    finalCount: followerCount,
    fps,
    frame,
    milestones,
  });
  const heroEntrance = spring({
    config: { damping: 200 },
    durationInFrames: Math.round(0.75 * fps),
    fps,
    frame: frame - Math.round(0.12 * fps),
  });
  const heroProgress = frame < 0.12 * fps ? 0 : heroEntrance;
  const celebrationEntrance = spring({
    config: { damping: 18, stiffness: 140 },
    durationInFrames: Math.round(0.8 * fps),
    fps,
    frame: frame - celebrationFrame,
  });
  const finalProgress = frame < celebrationFrame ? 0 : celebrationEntrance;
  const radii = [
    { x: width * 0.2, y: height * 0.17 },
    { x: width * 0.31, y: height * 0.28 },
    { x: width * 0.43, y: height * 0.4 },
  ] as const;

  return (
    <AbsoluteFill
      style={{
        background: palette.background,
        fontFamily: VIDEO_FONT_FAMILY,
        overflow: "hidden",
      }}
    >
      <div
        style={{
          background: `linear-gradient(90deg, transparent, ${palette.secondary}55, transparent)`,
          height: 2,
          left: "8%",
          position: "absolute",
          right: "8%",
          top: "12%",
        }}
      />
      <div
        style={{
          color: palette.muted,
          fontSize: 23,
          fontWeight: 700,
          left: "50%",
          letterSpacing: 8,
          position: "absolute",
          textTransform: "uppercase",
          top: "7.5%",
          transform: "translateX(-50%)",
        }}
      >
        Follower milestone · growing together
      </div>

      <svg
        aria-hidden="true"
        height={height}
        style={{ inset: 0, position: "absolute" }}
        viewBox={`0 0 ${width} ${height}`}
        width={width}
      >
        {radii.map((radius, index) => (
          <ellipse
            key={`ring-${index}`}
            cx={width / 2}
            cy={height / 2}
            fill="none"
            rx={radius.x}
            ry={radius.y}
            stroke={palette.line}
            strokeDasharray={index === 1 ? "10 16" : undefined}
            strokeOpacity={0.18 + index * 0.06}
            strokeWidth={2.5}
          />
        ))}
      </svg>

      {ORBIT_NODES.slice(0, visibleNodes).map((node, index) => {
        const radius = radii[node.ring];
        const angle = node.angle + (frame / fps) * RING_SPEEDS[node.ring];
        const x = width / 2 + Math.cos(angle) * radius.x;
        const y = height / 2 + Math.sin(angle) * radius.y;
        const appearFrame = getAvatarAppearFrame(
          index,
          milestones,
          celebrationFrame,
          fps
        );
        const size = width * (0.043 - node.ring * 0.004);

        return (
          <div
            key={`orbit-avatar-${index}`}
            style={{
              left: x,
              position: "absolute",
              top: y,
              transform: "translate(-50%, -50%)",
              zIndex: Math.round(20 + Math.sin(angle) * 8),
            }}
          >
            <TemplateAvatar
              accent={index % 2 === 0 ? palette.accent : palette.secondary}
              appearFrame={appearFrame}
              borderColor={palette.avatarSurface}
              follower={followers?.[index]}
              index={index}
              labelColor={palette.text}
              shadow={`0 14px 38px ${palette.accent}35`}
              showLabel={index < 2}
              size={size}
            />
          </div>
        );
      })}

      <div
        style={{
          alignItems: "center",
          background: palette.surface,
          border: `2px solid ${palette.line}45`,
          borderRadius: "50%",
          boxShadow: `0 30px 100px ${palette.accent}28, inset 0 0 0 12px ${palette.line}0f`,
          display: "flex",
          flexDirection: "column",
          height: width * 0.27,
          justifyContent: "center",
          left: "50%",
          opacity: heroProgress,
          position: "absolute",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(
            heroProgress,
            [0, 1],
            [0.94, 1]
          )})`,
          width: width * 0.27,
          zIndex: 12,
        }}
      >
        <div
          style={{
            color: palette.accent,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 6,
            textTransform: "uppercase",
          }}
        >
          Our orbit
        </div>
        <div
          style={{
            color: palette.text,
            fontSize: 154,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 700,
            letterSpacing: -8,
            lineHeight: 1,
            marginTop: 18,
          }}
        >
          {displayCount.toLocaleString()}
        </div>
        <div
          style={{
            color: palette.muted,
            fontSize: 34,
            marginTop: 12,
          }}
        >
          incredible followers
        </div>
        <div
          style={{
            color: palette.text,
            fontSize: 26,
            fontWeight: 700,
            marginTop: 26,
            opacity: finalProgress,
            transform: `translateY(${interpolate(
              finalProgress,
              [0, 1],
              [16, 0]
            )}px)`,
          }}
        >
          Thank you for the journey
        </div>
      </div>
    </AbsoluteFill>
  );
};
