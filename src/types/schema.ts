import { z } from "zod";

export const XThemeSchema = z.enum(["light", "dim", "lightsOut"]);
export type XTheme = z.infer<typeof XThemeSchema>;

export const VideoTemplateSchema = z.enum([
  "classic",
  "constellation",
  "orbit",
]);
export type VideoTemplate = z.infer<typeof VideoTemplateSchema>;

export const FollowerSchema = z.object({
  image: z.string().optional(),
  name: z.string(),
  verified: z.boolean().optional(),
});
export type Follower = z.infer<typeof FollowerSchema>;

export const CompositionProps = z.object({
  followerCount: z.number(),
  followers: z.array(FollowerSchema).optional(),
  template: VideoTemplateSchema,
  theme: XThemeSchema,
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  followerCount: 1000,
  template: "constellation",
  theme: "light",
};
