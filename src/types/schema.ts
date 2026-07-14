import { z } from "zod";

export const XThemeSchema = z.enum(["light", "dim", "lightsOut"]);
export type XTheme = z.infer<typeof XThemeSchema>;

export const FollowerSchema = z.object({
  image: z.string().optional(),
  name: z.string(),
  verified: z.boolean().optional(),
});
export type Follower = z.infer<typeof FollowerSchema>;

export const CompositionProps = z.object({
  followerCount: z.number(),
  followers: z.array(FollowerSchema).optional(),
  theme: XThemeSchema,
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  followerCount: 1000,
  theme: "light",
};
