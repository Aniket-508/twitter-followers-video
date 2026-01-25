import type { XTheme } from "../../types/constants";
import type { ThemeColors } from "./types";

/** Avatar dimensions and layout */
export const AVATAR = {
  SIZE: 48,
  OVERLAP: 16,
  FIRST_COLOR: "#3b82f6",
} as const;

/** Layout constants */
export const LAYOUT = {
  GRADIENT_WIDTH: 60,
  CELEBRATION_HEIGHT: 80,
  SCROLL_DISTANCE: 100,
  SCROLL_BUFFER: 100,
} as const;

/** Theme color configurations for X's display modes */
export const THEMES: Record<XTheme, ThemeColors> = {
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

/** Colorful palette for avatar backgrounds */
export const AVATAR_COLORS = [
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
] as const;

/** Spring animation configurations (Remotion best practices) */
export const SPRING_CONFIGS = {
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
  bouncy: { damping: 8 },
  heavy: { damping: 15, stiffness: 80, mass: 2 },
} as const;

/** Timing constants in seconds (converted to frames using fps) */
export const TIMING = {
  AVATAR_STAGGER: 0.066, // ~2 frames at 30fps
  AVATAR_STAGGER_FAST: 0.033, // ~1 frame at 30fps
  FADE_DURATION: 0.4, // ~12 frames at 30fps
  MILESTONE_INTERVAL: 1.0, // 1 second between milestones
  START_DELAY: 0.3, // Small delay before first milestone
  SPRING_SETTLE: 0.33, // Time for spring animation to settle
  SPRING_DELAY: 0.1, // Delay before text updates
} as const;
