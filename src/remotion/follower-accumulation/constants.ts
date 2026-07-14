import { SCALE } from "@/constants/remotion";

import type { XTheme } from "../../types/schema";
import type { ThemeColors } from "./types";

/** Avatar dimensions and layout (auto-scaled based on SCALE) */
export const AVATAR = {
  BORDER_WIDTH: 2 * SCALE,
  FIRST_COLOR: "#3b82f6",
  OVERLAP: 16 * SCALE,
  SIZE: 36 * SCALE,
} as const;

/** Layout constants (auto-scaled based on SCALE) */
export const LAYOUT = {
  CELEBRATION_HEIGHT: 80 * SCALE,
  GRADIENT_WIDTH: 60 * SCALE,
  SCROLL_DISTANCE: 100 * SCALE,
  ZOOM: 1.15,
} as const;

/** Theme color configurations for X's display modes */
export const THEMES: Record<XTheme, ThemeColors> = {
  dim: {
    avatarBorder: "#15202b",
    background: "#15202b",
    gradient: "#15202b",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.3)",
    text: "#f7f9f9",
    textSecondary: "#8b98a5",
  },
  light: {
    avatarBorder: "#ffffff",
    background: "#ffffff",
    gradient: "white",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)",
    text: "#0f1419",
    textSecondary: "#536471",
  },
  lightsOut: {
    avatarBorder: "#000000",
    background: "#000000",
    gradient: "#000000",
    shadow: "0 4px 6px -1px rgba(0, 0, 0, 0.5)",
    text: "#e7e9ea",
    textSecondary: "#71767b",
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
  bouncy: { damping: 8 },
  heavy: { damping: 15, mass: 2, stiffness: 80 },
  smooth: { damping: 200 },
  snappy: { damping: 20, stiffness: 200 },
} as const;

/** Timing constants in seconds (converted to frames using fps) */
export const TIMING = {
  /** ~2 frames at 30fps */
  AVATAR_STAGGER: 0.066,
  /** ~1 frame at 30fps */
  AVATAR_STAGGER_FAST: 0.033,
  /** ~12 frames at 30fps */
  FADE_DURATION: 0.4,
  /** 1 second between milestones */
  MILESTONE_INTERVAL: 1,
  /** Delay before text updates */
  SPRING_DELAY: 0.1,
  /** Time for spring animation to settle */
  SPRING_SETTLE: 0.33,
  /** Small delay before first milestone */
  START_DELAY: 0.3,
} as const;
