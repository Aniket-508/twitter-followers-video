import type { Follower, XTheme } from "@/types/schema";

export interface Milestone {
  frame: number;
  name: string;
  count: number;
  totalAvatars: number;
}

export interface ThemeColors {
  background: string;
  text: string;
  textSecondary: string;
  avatarBorder: string;
  shadow: string;
  gradient: string;
}

export interface FollowerTemplateProps {
  followerCount: number;
  followers?: Follower[];
  milestones: Milestone[];
  theme: XTheme;
}
