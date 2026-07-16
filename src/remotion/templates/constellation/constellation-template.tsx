import {
  AbsoluteFill,
  Easing,
  interpolate,
  random,
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

interface ConstellationPalette {
  accent: string;
  avatarSurface: string;
  background: string;
  line: string;
  muted: string;
  star: string;
  surface: string;
  text: string;
}

const PALETTES: Record<XTheme, ConstellationPalette> = {
  dim: {
    accent: "#7dd3fc",
    avatarSurface: "#172554",
    background:
      "radial-gradient(circle at 22% 18%, #1e3a8a 0, transparent 34%), radial-gradient(circle at 78% 80%, #581c87 0, transparent 38%), #0b1120",
    line: "#818cf8",
    muted: "#bfdbfe",
    star: "#e0f2fe",
    surface: "rgba(15, 23, 42, 0.78)",
    text: "#f8fafc",
  },
  light: {
    accent: "#4f46e5",
    avatarSurface: "#ffffff",
    background:
      "radial-gradient(circle at 18% 16%, #c7d2fe 0, transparent 34%), radial-gradient(circle at 82% 82%, #f5d0fe 0, transparent 38%), #eef2ff",
    line: "#6366f1",
    muted: "#475569",
    star: "#4f46e5",
    surface: "rgba(255, 255, 255, 0.78)",
    text: "#172554",
  },
  lightsOut: {
    accent: "#a78bfa",
    avatarSurface: "#09090b",
    background:
      "radial-gradient(circle at 22% 16%, #312e81 0, transparent 34%), radial-gradient(circle at 80% 78%, #4a044e 0, transparent 36%), #000000",
    line: "#8b5cf6",
    muted: "#c4b5fd",
    star: "#ffffff",
    surface: "rgba(9, 9, 11, 0.82)",
    text: "#fafafa",
  },
};

const NODE_POSITIONS = [
  { x: 0.09, y: 0.24 },
  { x: 0.2, y: 0.13 },
  { x: 0.34, y: 0.25 },
  { x: 0.48, y: 0.1 },
  { x: 0.63, y: 0.21 },
  { x: 0.76, y: 0.12 },
  { x: 0.9, y: 0.26 },
  { x: 0.14, y: 0.48 },
  { x: 0.28, y: 0.42 },
  { x: 0.72, y: 0.41 },
  { x: 0.87, y: 0.49 },
  { x: 0.08, y: 0.72 },
  { x: 0.21, y: 0.84 },
  { x: 0.35, y: 0.7 },
  { x: 0.49, y: 0.88 },
  { x: 0.64, y: 0.72 },
  { x: 0.78, y: 0.84 },
  { x: 0.91, y: 0.7 },
] as const;

const CONNECTIONS = [
  [0, 1],
  [1, 2],
  [2, 3],
  [3, 4],
  [4, 5],
  [5, 6],
  [0, 7],
  [2, 8],
  [4, 9],
  [6, 10],
  [7, 8],
  [9, 10],
  [7, 11],
  [8, 13],
  [9, 15],
  [10, 17],
  [11, 12],
  [12, 13],
  [13, 14],
  [14, 15],
  [15, 16],
  [16, 17],
  [1, 8],
  [5, 9],
] as const;

const STARS = Array.from({ length: 72 }, (_, index) => ({
  phase: random(`constellation-star-${index}-phase`) * Math.PI * 2,
  size: 2 + random(`constellation-star-${index}-size`) * 5,
  x: random(`constellation-star-${index}-x`) * 100,
  y: random(`constellation-star-${index}-y`) * 100,
}));

export const ConstellationTemplate = ({
  followerCount,
  followers,
  milestones,
  theme,
}: FollowerTemplateProps) => {
  const frame = useCurrentFrame();
  const { fps, width } = useVideoConfig();
  const palette = PALETTES[theme];
  const currentMilestone = getCurrentMilestone(frame, milestones);
  const celebrationFrame = getCelebrationFrame(milestones);
  const visibleNodes = Math.min(
    currentMilestone.totalAvatars,
    NODE_POSITIONS.length
  );
  const displayCount = getAnimatedFollowerCount({
    finalCount: followerCount,
    fps,
    frame,
    milestones,
  });
  const heroEntrance = spring({
    config: { damping: 200 },
    durationInFrames: Math.round(0.8 * fps),
    fps,
    frame: frame - Math.round(0.15 * fps),
  });
  const heroProgress = frame < 0.15 * fps ? 0 : heroEntrance;
  const celebrationProgress = spring({
    config: { damping: 200 },
    durationInFrames: Math.round(0.7 * fps),
    fps,
    frame: frame - celebrationFrame,
  });
  const finalProgress = frame < celebrationFrame ? 0 : celebrationProgress;
  const avatarSize = width * 0.052;

  return (
    <AbsoluteFill
      style={{
        background: palette.background,
        fontFamily: VIDEO_FONT_FAMILY,
        overflow: "hidden",
      }}
    >
      {STARS.map((star, index) => {
        const pulse =
          (Math.sin(frame / (16 + (index % 13)) + star.phase) + 1) / 2;
        return (
          <span
            key={`star-${index}`}
            style={{
              backgroundColor: palette.star,
              borderRadius: "50%",
              height: star.size,
              left: `${star.x}%`,
              opacity: 0.12 + pulse * 0.5,
              position: "absolute",
              top: `${star.y}%`,
              transform: `scale(${0.75 + pulse * 0.45})`,
              width: star.size,
            }}
          />
        );
      })}

      <svg
        aria-hidden="true"
        height="100%"
        style={{ inset: 0, position: "absolute" }}
        viewBox={`0 0 ${width} ${width * 0.5625}`}
        width="100%"
      >
        {CONNECTIONS.map(([startIndex, endIndex]) => {
          if (Math.max(startIndex, endIndex) >= visibleNodes) {
            return null;
          }

          const start = NODE_POSITIONS[startIndex];
          const end = NODE_POSITIONS[endIndex];
          const appearFrame = getAvatarAppearFrame(
            Math.max(startIndex, endIndex),
            milestones,
            celebrationFrame,
            fps
          );
          const drawProgress = interpolate(
            frame,
            [appearFrame, appearFrame + Math.round(0.45 * fps)],
            [0, 1],
            {
              easing: Easing.out(Easing.cubic),
              extrapolateLeft: "clamp",
              extrapolateRight: "clamp",
            }
          );

          return (
            <line
              key={`${startIndex}-${endIndex}`}
              pathLength={1}
              stroke={palette.line}
              strokeDasharray={1}
              strokeDashoffset={1 - drawProgress}
              strokeLinecap="round"
              strokeOpacity={0.4}
              strokeWidth={2.5}
              x1={start.x * width}
              x2={end.x * width}
              y1={start.y * width * 0.5625}
              y2={end.y * width * 0.5625}
            />
          );
        })}
      </svg>

      {NODE_POSITIONS.slice(0, visibleNodes).map((position, index) => {
        const appearFrame = getAvatarAppearFrame(
          index,
          milestones,
          celebrationFrame,
          fps
        );

        return (
          <div
            key={`node-${index}`}
            style={{
              left: `${position.x * 100}%`,
              position: "absolute",
              top: `${position.y * 100}%`,
              transform: "translate(-50%, -50%)",
              zIndex: 2,
            }}
          >
            <TemplateAvatar
              accent={palette.accent}
              appearFrame={appearFrame}
              borderColor={palette.avatarSurface}
              follower={followers?.[index]}
              index={index}
              labelColor={palette.text}
              shadow={`0 0 0 8px ${palette.surface}, 0 0 38px ${palette.accent}66`}
              showLabel={index < 3}
              size={avatarSize}
            />
          </div>
        );
      })}

      <div
        style={{
          alignItems: "center",
          background: palette.surface,
          border: `1px solid ${palette.accent}55`,
          borderRadius: 44,
          boxShadow: `0 28px 90px ${palette.accent}24`,
          display: "flex",
          flexDirection: "column",
          left: "50%",
          minWidth: width * 0.34,
          opacity: heroProgress,
          padding: "52px 84px 48px",
          position: "absolute",
          top: "50%",
          transform: `translate(-50%, -50%) scale(${interpolate(
            heroProgress,
            [0, 1],
            [0.96, 1]
          )})`,
          zIndex: 3,
        }}
      >
        <div
          style={{
            color: palette.accent,
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: 7,
            textTransform: "uppercase",
          }}
        >
          {finalProgress > 0.5 ? "Milestone reached" : "Your community"}
        </div>
        <div
          style={{
            color: palette.text,
            fontSize: 164,
            fontVariantNumeric: "tabular-nums",
            fontWeight: 700,
            letterSpacing: -9,
            lineHeight: 1,
            marginTop: 18,
          }}
        >
          {displayCount.toLocaleString()}
        </div>
        <div
          style={{
            color: palette.muted,
            fontSize: 36,
            marginTop: 14,
          }}
        >
          followers in your universe
        </div>
        <div
          style={{
            color: palette.text,
            fontSize: 26,
            fontWeight: 700,
            marginTop: 28,
            opacity: finalProgress,
            transform: `translateY(${interpolate(
              finalProgress,
              [0, 1],
              [14, 0]
            )}px)`,
          }}
        >
          Thank you for making it shine ✦
        </div>
      </div>
    </AbsoluteFill>
  );
};
