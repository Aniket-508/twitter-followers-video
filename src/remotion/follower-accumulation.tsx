import React, { useMemo } from "react";
import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
  Img,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/DMSans";
import { useState } from "react";

// Twitter/X verified badge SVG component
const VerifiedBadge: React.FC<{ size?: number }> = ({ size = 24 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 22 22"
    width={size}
    height={size}
  >
    <path
      d="M20.396 11c-.018-.646-.215-1.275-.57-1.816-.354-.54-.852-.972-1.438-1.246.223-.607.27-1.264.14-1.897-.131-.634-.437-1.218-.882-1.687-.47-.445-1.053-.75-1.687-.882-.633-.13-1.29-.083-1.897.14-.273-.587-.704-1.086-1.245-1.44S11.647 1.62 11 1.604c-.646.017-1.273.213-1.813.568s-.969.854-1.24 1.44c-.608-.223-1.267-.272-1.902-.14-.635.13-1.22.436-1.69.882-.445.47-.749 1.055-.878 1.688-.13.633-.08 1.29.144 1.896-.587.274-1.087.705-1.443 1.245-.356.54-.555 1.17-.574 1.817.02.647.218 1.276.574 1.817.356.54.856.972 1.443 1.245-.224.606-.274 1.263-.144 1.896.13.634.433 1.218.877 1.688.47.443 1.054.747 1.687.878.633.132 1.29.084 1.897-.136.274.586.705 1.084 1.246 1.439.54.354 1.17.551 1.816.569.647-.016 1.276-.213 1.817-.567s.972-.854 1.245-1.44c.604.239 1.266.296 1.903.164.636-.132 1.22-.447 1.68-.907.46-.46.776-1.044.908-1.681s.075-1.299-.165-1.903c.586-.274 1.084-.705 1.439-1.246.354-.54.551-1.17.569-1.816zM9.662 14.85l-3.429-3.428 1.293-1.302 2.072 2.072 4.4-4.794 1.347 1.246z"
      fill="#1d9bf0"
    />
  </svg>
);

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

// X/Twitter theme configurations
export type XTheme = "light" | "dim" | "lightsOut";

const THEMES = {
  light: {
    background: "#ffffff",
    text: "#0f1419",
    textSecondary: "#536471",
    avatarBorder: "#ffffff",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    gradient: "white",
  },
  dim: {
    background: "#15202b",
    text: "#f7f9f9",
    textSecondary: "#8b98a5",
    avatarBorder: "#15202b",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    gradient: "#15202b",
  },
  lightsOut: {
    background: "#000000",
    text: "#e7e9ea",
    textSecondary: "#71767b",
    avatarBorder: "#000000",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
    gradient: "#000000",
  },
} as const;

// Colors for avatar placeholders
const AVATAR_COLORS = [
  "#ef4444",
  "#f97316",
  "#f59e0b",
  "#eab308",
  "#84cc16",
  "#22c55e",
  "#10b981",
  "#14b8a6",
  "#06b6d4",
  "#0ea5e9",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#a855f7",
  "#d946ef",
  "#ec4899",
  "#f43f5e",
  "#78716c",
  "#71717a",
  "#737373",
];

// Spring configurations (from Remotion best practices)
const SPRING_CONFIGS = {
  smooth: { damping: 200 }, // Smooth, no bounce (subtle reveals)
  snappy: { damping: 20, stiffness: 200 }, // Snappy, minimal bounce (UI elements)
  bouncy: { damping: 8 }, // Bouncy entrance (playful animations)
  heavy: { damping: 15, stiffness: 80, mass: 2 }, // Heavy, slow, small bounce
} as const;

// Timing constants (in seconds, will be converted to frames using fps)
// Milestone timing is now dynamic based on follower count
const TIMING = {
  AVATAR_STAGGER: 0.066, // 2 frames at 30fps - time between avatar appearances
  AVATAR_STAGGER_FAST: 0.033, // 1 frame at 30fps - faster stagger during celebration
  COUNT_ANIMATION: 0.66, // 20 frames at 30fps
  FADE_DURATION: 0.4, // 12 frames at 30fps
} as const;

// Milestone configuration
interface Milestone {
  frame: number;
  name: string;
  count: number;
  totalAvatars: number;
}

// Calculate max avatars that fit in frame width
function calculateMaxAvatars(frameWidth: number): number {
  const avatarWidth = 48;
  const overlap = 16;
  // First avatar takes full width, each additional takes (avatarWidth - overlap)
  const remaining = frameWidth - avatarWidth;
  const additionalAvatars = Math.floor(remaining / (avatarWidth - overlap));
  return 1 + additionalAvatars;
}

// Generate milestones based on final follower count and frame width
// Always creates exactly 3 milestones + celebration
function generateMilestones(
  finalCount: number,
  frameWidth: number,
  fps: number,
  followers?: { name: string; image?: string }[],
): Milestone[] {
  const maxAvatars = calculateMaxAvatars(frameWidth);

  // Base interval between milestones (in seconds)
  const milestoneInterval = 1.0; // 1 second between each milestone
  const startDelay = 0.3; // Small delay before first milestone

  // Names for milestones
  const names =
    followers && followers.length >= 4
      ? followers.slice(0, 4).map((f) => f.name)
      : ["John", "Alex", "Sarah", "Cheers"];

  // Calculate avatar counts for each milestone (progressive increase)
  // Milestone 1: ~20% of max, Milestone 2: ~50% of max, Milestone 3: ~80% of max
  const avatarCounts = [
    Math.max(2, Math.round(maxAvatars * 0.2)),
    Math.max(4, Math.round(maxAvatars * 0.5)),
    Math.max(6, Math.round(maxAvatars * 0.8)),
  ];

  // Build exactly 3 milestones
  const milestones: Milestone[] = [];
  let currentFrame = Math.round(startDelay * fps);

  for (let i = 0; i < 3; i++) {
    const avatars = Math.min(avatarCounts[i], maxAvatars);
    milestones.push({
      frame: currentFrame,
      name: names[i],
      count: avatars - 1,
      totalAvatars: avatars,
    });
    currentFrame += Math.round(milestoneInterval * fps);
  }

  // Celebration happens 1 second after the last milestone
  const celebrationFrame = currentFrame;

  // Final milestone (celebration) shows all avatars that fit
  milestones.push({
    frame: celebrationFrame,
    name: names[3],
    count: maxAvatars - 1,
    totalAvatars: maxAvatars,
  });

  return milestones;
}

// Helper to get the celebration frame from milestones
function getCelebrationFrame(milestones: Milestone[]): number {
  return milestones[milestones.length - 1].frame;
}

// Get current milestone based on frame
function getCurrentMilestone(
  frame: number,
  milestones: Milestone[],
): Milestone {
  return (
    milestones
      .slice()
      .reverse()
      .find((m) => frame >= m.frame) || milestones[0]
  );
}

// Get previous milestone for count animation
function getPreviousMilestone(
  frame: number,
  milestones: Milestone[],
): Milestone | null {
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (frame >= milestones[i].frame) {
      return i > 0 ? milestones[i - 1] : null;
    }
  }
  return null;
}

// Calculate when each avatar should appear based on milestones
// During celebration, avatars appear faster in a continuous stream
function getAvatarAppearFrame(
  index: number,
  milestones: Milestone[],
  celebrationStart: number,
  fps: number,
): number {
  let previousAvatarCount = 0;

  // Convert stagger timing to frames
  const normalStagger = Math.round(TIMING.AVATAR_STAGGER * fps);
  const fastStagger = Math.round(TIMING.AVATAR_STAGGER_FAST * fps);

  for (const milestone of milestones) {
    if (index < milestone.totalAvatars) {
      const positionInMilestone = index - previousAvatarCount;

      // For the final milestone (celebration), avatars appear very quickly
      if (milestone.frame >= celebrationStart) {
        return celebrationStart + positionInMilestone * fastStagger;
      }

      // Normal milestones: avatars appear with normal stagger
      return milestone.frame + positionInMilestone * normalStagger;
    }
    previousAvatarCount = milestone.totalAvatars;
  }
  return 0;
}

// Avatar component with spring animation
interface AvatarProps {
  index: number;
  isFirst: boolean;
  milestones: Milestone[];
  celebrationStart: number;
  theme: XTheme;
  follower?: { name: string; image?: string };
}

const Avatar: React.FC<AvatarProps> = ({
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
  const [imageError, setImageError] = useState(false);

  const appearFrame = getAvatarAppearFrame(
    index,
    milestones,
    celebrationStart,
    fps,
  );
  const animationFrame = frame - appearFrame;

  // Use recommended spring configs: snappy for normal, even snappier for celebration
  const isCelebrationAvatar = appearFrame >= celebrationStart;

  const scale = spring({
    frame: animationFrame,
    fps,
    config: isCelebrationAvatar
      ? { ...SPRING_CONFIGS.snappy, stiffness: 300 } // Extra snappy for celebration
      : SPRING_CONFIGS.snappy,
  });

  const clampedScale = animationFrame < 0 ? 0 : Math.min(scale, 1);

  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

  // Fallback to Dicebear if no image or image fails to load
  const avatarUrl =
    !follower?.image || imageError
      ? `https://api.dicebear.com/7.x/avataaars/svg?seed=${follower?.name || index}`
      : follower.image;

  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        marginLeft: index === 0 ? 0 : -16,
        zIndex: 100 - index,
        transform: `scale(${clampedScale})`,
        opacity: clampedScale,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `2px solid ${colors.avatarBorder}`,
          overflow: "hidden",
          boxShadow: colors.shadow,
          backgroundColor: isFirst ? "#3b82f6" : avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Img
          src={avatarUrl}
          onError={() => setImageError(true)}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

// Filler avatar component (no animation, just appears)
interface FillerAvatarProps {
  index: number;
  theme: XTheme;
}

const FillerAvatar: React.FC<FillerAvatarProps> = ({ index, theme }) => {
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];
  const colors = THEMES[theme];

  return (
    <div
      style={{
        position: "relative",
        flexShrink: 0,
        marginLeft: -16,
        zIndex: 100 - index,
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: "50%",
          border: `2px solid ${colors.avatarBorder}`,
          overflow: "hidden",
          boxShadow: colors.shadow,
          backgroundColor: avatarColor,
        }}
      >
        <Img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=filler-${index}`}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </div>
    </div>
  );
};

// AvatarStack component with smooth scrolling
interface AvatarStackProps {
  limit: number;
  marqueeOffset: number;
  milestones: Milestone[];
  celebrationStart: number;
  fillerCount: number;
  theme: XTheme;
  followers?: { name: string; image?: string }[];
}

const AvatarStack: React.FC<AvatarStackProps> = ({
  limit,
  marqueeOffset,
  milestones,
  celebrationStart,
  fillerCount,
  theme,
  followers,
}) => {
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
      {/* Main avatars with animation */}
      {Array.from({ length: limit }).map((_, index) => (
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
      {/* Filler avatars to prevent white space during scroll */}
      {fillerCount > 0 &&
        Array.from({ length: fillerCount }).map((_, index) => (
          <FillerAvatar
            key={`filler-${index}`}
            index={limit + index}
            theme={theme}
          />
        ))}
    </div>
  );
};

// TextLabel component
interface TextLabelProps {
  name: string;
  count: number;
  finalCount: number;
  milestones: Milestone[];
  theme: XTheme;
  followers?: { name: string; image?: string }[];
}

const TextLabel: React.FC<TextLabelProps> = ({
  name,
  count,
  finalCount,
  milestones,
  theme,
  followers,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = THEMES[theme];

  const currentMilestone = getCurrentMilestone(frame, milestones);
  const previousMilestone = getPreviousMilestone(frame, milestones);

  // Get dynamic celebration frame from milestones
  const celebrationFrame = getCelebrationFrame(milestones);
  const normalStagger = Math.round(TIMING.AVATAR_STAGGER * fps);
  const fastStagger = Math.round(TIMING.AVATAR_STAGGER_FAST * fps);

  let displayCount = count;

  // Animate count for ALL milestones, matching avatar appearance speed
  if (currentMilestone && frame >= currentMilestone.frame) {
    const milestoneStart = currentMilestone.frame;
    const previousOthers = previousMilestone
      ? previousMilestone.totalAvatars - 1
      : 0;
    const previousAvatars = previousMilestone?.totalAvatars ?? 1;

    // Check if this is the final milestone (celebration)
    const isFinalMilestone = currentMilestone.frame === celebrationFrame;

    // Calculate duration based on number of new avatars × stagger time
    const newAvatars = currentMilestone.totalAvatars - previousAvatars;
    const staggerTime = isFinalMilestone ? fastStagger : normalStagger;
    const avatarAnimationDuration = newAvatars * staggerTime;

    if (isFinalMilestone) {
      // Final milestone: animate from previous total to final follower count
      displayCount = Math.round(
        interpolate(
          frame,
          [milestoneStart, milestoneStart + avatarAnimationDuration],
          [previousAvatars - 1, finalCount - 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
      );
    } else {
      // Regular milestones: animate count matching avatar appearance speed
      displayCount = Math.round(
        interpolate(
          frame,
          [milestoneStart, milestoneStart + avatarAnimationDuration],
          [previousOthers, currentMilestone.totalAvatars - 1],
          {
            extrapolateLeft: "clamp",
            extrapolateRight: "clamp",
          },
        ),
      );
    }
  }

  // Dynamically pick the name based on the current animated count
  // The person being named is the one "at the head", i.e., at index displayCount
  const currentName = followers?.[displayCount]?.name || name;

  const formattedCount =
    displayCount >= 1000
      ? displayCount.toLocaleString()
      : displayCount.toString();

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        marginTop: 20,
        whiteSpace: "nowrap",
        fontFamily,
      }}
    >
      <span
        style={{
          fontSize: 24,
          fontWeight: 600,
          color: colors.text,
        }}
      >
        {currentName}
      </span>
      <span style={{ marginLeft: 4, display: "inline-flex" }}>
        <VerifiedBadge size={24} />
      </span>
      {displayCount > 0 && (
        <span
          style={{
            fontSize: 24,
            color: colors.textSecondary,
            marginLeft: 8,
          }}
        >
          and{" "}
          <span style={{ fontWeight: 600, color: colors.text }}>
            {formattedCount}
          </span>{" "}
          others followed you
        </span>
      )}
      {displayCount === 0 && (
        <span
          style={{
            fontSize: 24,
            color: colors.textSecondary,
            marginLeft: 8,
          }}
        >
          followed you
        </span>
      )}
    </div>
  );
};

// Celebration component
interface CelebrationProps {
  theme: XTheme;
  finalCount: number;
  milestones: Milestone[];
}

const Celebration: React.FC<CelebrationProps> = ({ theme, milestones }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const colors = THEMES[theme];

  // Get dynamic celebration frame from milestones
  const celebrationStart = getCelebrationFrame(milestones);
  const fadeDuration = Math.round(TIMING.FADE_DURATION * fps);

  // Slide up animation using recommended heavy spring for dramatic effect
  const slideProgress = spring({
    frame: Math.max(0, frame - celebrationStart),
    fps,
    config: SPRING_CONFIGS.heavy,
  });

  // Animate height from 0 to full height so it pushes content down
  const maxHeight = 80; // Height of the text + margin
  const height =
    frame < celebrationStart
      ? 0
      : interpolate(slideProgress, [0, 1], [0, maxHeight]);

  // Start 30px below and move up to final position
  const translateY =
    frame < celebrationStart ? 30 : interpolate(slideProgress, [0, 1], [30, 0]);

  // Fade in as it slides up
  const opacity = interpolate(
    frame,
    [celebrationStart, celebrationStart + fadeDuration],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    },
  );

  return (
    <div
      style={{
        height,
        overflow: "hidden",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-end",
        marginBottom: height > 0 ? 16 : 0,
      }}
    >
      <h1
        style={{
          fontSize: 60,
          fontWeight: 700,
          color: colors.text,
          whiteSpace: "nowrap",
          margin: 0,
          fontFamily,
          transform: `translateY(${translateY}px)`,
          opacity,
        }}
      >
        Thank You!
      </h1>
    </div>
  );
};

// Main FollowerAccumulation component
export interface FollowerAccumulationProps {
  followerCount: number;
  theme?: XTheme;
  followers?: { name: string; image?: string }[];
}

export const FollowerAccumulation: React.FC<FollowerAccumulationProps> = ({
  followerCount,
  theme = "light",
  followers,
}) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames, width } = useVideoConfig();
  const colors = THEMES[theme];

  // Memoize milestones - only recalculate when dependencies change
  const milestones = useMemo(
    () => generateMilestones(followerCount, width, fps, followers),
    [followerCount, width, fps, followers],
  );

  // Get dynamic celebration frame from milestones
  const celebrationStart = getCelebrationFrame(milestones);

  // Calculate timing using fps (best practice: define timing in seconds)
  const fastStagger = Math.round(TIMING.AVATAR_STAGGER_FAST * fps);
  const springSettleTime = Math.round(0.33 * fps);

  const currentMilestone = getCurrentMilestone(frame, milestones);

  let containerScale: number;

  if (frame < celebrationStart) {
    // Subtle zoom out from 1.15x to 1.0x using easing (best practice)
    containerScale = interpolate(
      frame,
      [0, celebrationStart - 1],
      [1.15, 1.0],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.cubic),
      },
    );
  } else {
    // Smooth spring back to 1.1x at celebration using recommended config
    const springBack = spring({
      frame: frame - celebrationStart,
      fps,
      config: SPRING_CONFIGS.heavy,
    });
    containerScale = interpolate(springBack, [0, 1], [1.0, 1.1]);
  }

  // Calculate when all avatars have finished appearing
  const previousMilestoneAvatars =
    milestones[milestones.length - 2]?.totalAvatars || 0;
  const newAvatarsInCelebration =
    currentMilestone.totalAvatars - previousMilestoneAvatars;
  const lastAvatarAppearFrame =
    celebrationStart + newAvatarsInCelebration * fastStagger;
  const allAvatarsVisibleFrame = lastAvatarAppearFrame + springSettleTime;

  // Smooth scroll left starting after all avatars are visible
  let marqueeOffset = 0;
  const totalScrollDistance = 100; // Gentle scroll distance

  if (frame >= allAvatarsVisibleFrame) {
    marqueeOffset = interpolate(
      frame,
      [allAvatarsVisibleFrame, durationInFrames],
      [0, -totalScrollDistance],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.out(Easing.quad), // Smooth deceleration (best practice)
      },
    );
  }

  // Calculate filler avatars needed to prevent white space during scroll
  // Only show fillers after all main avatars have appeared
  const avatarEffectiveWidth = 32;
  const fillerCount =
    frame >= allAvatarsVisibleFrame
      ? Math.ceil(totalScrollDistance / avatarEffectiveWidth) + 2 // Extra buffer
      : 0;

  return (
    <AbsoluteFill style={{ backgroundColor: colors.background }}>
      {/* Left fade gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          width: 60,
          background: `linear-gradient(to right, ${colors.gradient}, transparent)`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      {/* Right fade gradient */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          right: 0,
          width: 60,
          background: `linear-gradient(to left, ${colors.gradient}, transparent)`,
          zIndex: 10,
          pointerEvents: "none",
        }}
      />
      <AbsoluteFill className="justify-center items-center">
        <div
          style={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            fontFamily,
            transform: `scale(${containerScale})`,
          }}
        >
          <Celebration
            finalCount={followerCount}
            theme={theme}
            milestones={milestones}
          />
          <AvatarStack
            limit={currentMilestone.totalAvatars}
            marqueeOffset={marqueeOffset}
            milestones={milestones}
            celebrationStart={celebrationStart}
            fillerCount={fillerCount}
            theme={theme}
            followers={followers}
          />
          <TextLabel
            name={currentMilestone.name}
            count={currentMilestone.count}
            finalCount={followerCount}
            milestones={milestones}
            theme={theme}
            followers={followers}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
