import {
  AbsoluteFill,
  Easing,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { loadFont, fontFamily } from "@remotion/google-fonts/Inter";
import { User, BadgeCheck } from "lucide-react";

loadFont("normal", {
  subsets: ["latin"],
  weights: ["400", "700"],
});

// Colors for avatar placeholders
const AVATAR_COLORS = [
  "#ef4444", "#f97316", "#f59e0b", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4", "#0ea5e9",
  "#3b82f6", "#6366f1", "#8b5cf6", "#a855f7", "#d946ef",
  "#ec4899", "#f43f5e", "#78716c", "#71717a", "#737373",
];

// Milestone configuration
interface Milestone {
  frame: number;
  name: string;
  count: number;
  totalAvatars: number;
}

// Generate milestones based on final follower count
function generateMilestones(finalCount: number): Milestone[] {
  const milestones: Milestone[] = [
    { frame: 0, name: "John", count: 1, totalAvatars: 2 },
  ];

  if (finalCount >= 10) {
    milestones.push({ frame: 40, name: "Alex", count: Math.floor(finalCount * 0.05), totalAvatars: 4 });
  }
  if (finalCount >= 50) {
    milestones.push({ frame: 70, name: "Kamal", count: Math.floor(finalCount * 0.15), totalAvatars: 11 });
  }
  if (finalCount >= 100) {
    milestones.push({ frame: 100, name: "Sarah", count: Math.floor(finalCount * 0.4), totalAvatars: 20 });
  }
  
  milestones.push({ frame: 130, name: "Cheers", count: finalCount, totalAvatars: 40 });

  return milestones;
}

// Get current milestone based on frame
function getCurrentMilestone(frame: number, milestones: Milestone[]): Milestone {
  return (
    milestones.slice()
      .reverse()
      .find((m) => frame >= m.frame) || milestones[0]
  );
}

// Get previous milestone for count animation
function getPreviousMilestone(frame: number, milestones: Milestone[]): Milestone | null {
  for (let i = milestones.length - 1; i >= 0; i--) {
    if (frame >= milestones[i].frame) {
      return i > 0 ? milestones[i - 1] : null;
    }
  }
  return null;
}

// Calculate when each avatar should appear based on milestones
function getAvatarAppearFrame(index: number, milestones: Milestone[]): number {
  let previousAvatarCount = 0;
  for (const milestone of milestones) {
    if (index < milestone.totalAvatars) {
      const positionInMilestone = index - previousAvatarCount;
      return milestone.frame + positionInMilestone * 3;
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
}

const Avatar: React.FC<AvatarProps> = ({ index, isFirst, milestones }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const appearFrame = getAvatarAppearFrame(index, milestones);
  const animationFrame = frame - appearFrame;

  const scale = spring({
    frame: animationFrame,
    fps,
    config: {
      damping: 12,
      stiffness: 200,
      mass: 0.5,
    },
  });

  const clampedScale = animationFrame < 0 ? 0 : Math.min(scale, 1);
  const avatarColor = AVATAR_COLORS[index % AVATAR_COLORS.length];

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
          border: "2px solid white",
          overflow: "hidden",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
          backgroundColor: isFirst ? "#3b82f6" : avatarColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <User style={{ width: 24, height: 24, color: "white" }} />
      </div>
    </div>
  );
};

// AvatarStack component with marquee effect
interface AvatarStackProps {
  limit: number;
  marqueeOffset: number;
  milestones: Milestone[];
}

const AvatarStack: React.FC<AvatarStackProps> = ({ limit, marqueeOffset, milestones }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        transform: `translateX(${marqueeOffset}px)`,
      }}
    >
      {Array.from({ length: limit }).map((_, index) => (
        <Avatar key={index} index={index} isFirst={index === 0} milestones={milestones} />
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
}

const TextLabel: React.FC<TextLabelProps> = ({ name, count, finalCount, milestones }) => {
  const frame = useCurrentFrame();

  const currentMilestone = getCurrentMilestone(frame, milestones);
  const previousMilestone = getPreviousMilestone(frame, milestones);

  let displayCount = count;

  if (currentMilestone.frame === 130 && frame >= 130) {
    const countAnimationDuration = 15;
    const previousCount = previousMilestone?.count ?? Math.floor(finalCount * 0.4);

    displayCount = Math.round(
      interpolate(
        frame,
        [130, 130 + countAnimationDuration],
        [previousCount, finalCount],
        {
          extrapolateLeft: "clamp",
          extrapolateRight: "clamp",
        }
      )
    );
  }

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
          color: "#111827",
        }}
      >
        {name}
      </span>
      <BadgeCheck
        style={{
          width: 24,
          height: 24,
          marginLeft: 4,
          color: "#3b82f6",
          fill: "#3b82f6",
        }}
      />
      <span
        style={{
          fontSize: 24,
          color: "#374151",
          marginLeft: 8,
        }}
      >
        and{" "}
        <span style={{ fontWeight: 600, color: "#111827" }}>
          {formattedCount}
        </span>{" "}
        others followed you
      </span>
    </div>
  );
};

// Celebration component
interface CelebrationProps {
  finalCount: number;
}

const Celebration: React.FC<CelebrationProps> = ({ finalCount }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const CELEBRATION_START = 130;

  if (frame < CELEBRATION_START) {
    return null;
  }

  const scale = spring({
    frame: frame - CELEBRATION_START,
    fps,
    config: {
      damping: 10,
      stiffness: 120,
    },
  });

  const opacity = interpolate(
    frame,
    [CELEBRATION_START, CELEBRATION_START + 10],
    [0, 1],
    {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
    }
  );

  return (
    <div
      style={{
        position: "absolute",
        top: -96,
        left: "50%",
        fontFamily,
        transform: `translateX(-50%) scale(${scale})`,
        opacity,
      }}
    >
      <h1
        style={{
          fontSize: 60,
          fontWeight: 700,
          color: "#3b82f6",
          whiteSpace: "nowrap",
          margin: 0,
        }}
      >
        {finalCount >= 1000 ? "Thank You!" : `${finalCount.toLocaleString()} Followers!`}
      </h1>
    </div>
  );
};

// Main FollowerAccumulation component
export interface FollowerAccumulationProps {
  followerCount: number;
}

export const FollowerAccumulation: React.FC<FollowerAccumulationProps> = ({ followerCount }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  
  const milestones = generateMilestones(followerCount);
  const currentMilestone = getCurrentMilestone(frame, milestones);

  const CELEBRATION_START = 130;
  const MARQUEE_START = 140;

  let containerScale: number;

  if (frame < CELEBRATION_START) {
    containerScale = interpolate(frame, [0, CELEBRATION_START - 1], [1.5, 1.0], {
      extrapolateLeft: "clamp",
      extrapolateRight: "clamp",
      easing: Easing.out(Easing.quad),
    });
  } else {
    const springBack = spring({
      frame: frame - CELEBRATION_START,
      fps,
      config: {
        damping: 15,
        stiffness: 80,
      },
    });
    containerScale = interpolate(springBack, [0, 1], [1.0, 1.5]);
  }

  let marqueeOffset = 0;
  if (frame >= MARQUEE_START) {
    const totalAvatars = currentMilestone.totalAvatars;
    const avatarWidth = 48;
    const overlap = 16;
    const totalWidth = avatarWidth + (totalAvatars - 1) * (avatarWidth - overlap);
    
    marqueeOffset = interpolate(
      frame,
      [MARQUEE_START, durationInFrames],
      [0, -totalWidth * 0.5],
      {
        extrapolateLeft: "clamp",
        extrapolateRight: "clamp",
        easing: Easing.inOut(Easing.quad),
      }
    );
  }

  return (
    <AbsoluteFill className="bg-white">
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
          <Celebration finalCount={followerCount} />
          <AvatarStack 
            limit={currentMilestone.totalAvatars} 
            marqueeOffset={marqueeOffset} 
            milestones={milestones}
          />
          <TextLabel 
            name={currentMilestone.name} 
            count={currentMilestone.count} 
            finalCount={followerCount}
            milestones={milestones}
          />
        </div>
      </AbsoluteFill>
    </AbsoluteFill>
  );
};
