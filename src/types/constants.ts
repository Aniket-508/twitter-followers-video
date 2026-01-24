import { z } from "zod";
export const COMP_NAME = "MyComp";

// X/Twitter theme options
export const XThemeSchema = z.enum(["light", "dim", "lightsOut"]);
export type XTheme = z.infer<typeof XThemeSchema>;

export const CompositionProps = z.object({
  followerCount: z.number(),
  theme: XThemeSchema,
  followers: z
    .array(
      z.object({
        name: z.string(),
        image: z.string(),
        verified: z.boolean(),
      }),
    )
    .optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  followerCount: 1000,
  theme: "light",
};

export const DURATION_IN_FRAMES = 210; // 7 seconds at 30fps
export const VIDEO_WIDTH = 640;
export const VIDEO_HEIGHT = 360;
export const VIDEO_FPS = 30;
