import { z } from "zod";

export const XThemeSchema = z.enum(["light", "dim", "lightsOut"]);
export type XTheme = z.infer<typeof XThemeSchema>;

export const FollowerSchema = z.object({
  name: z.string(),
  image: z.string().optional(),
  verified: z.boolean().optional(),
});
export type Follower = z.infer<typeof FollowerSchema>;

export const CompositionProps = z.object({
  followerCount: z.number(),
  theme: XThemeSchema,
  followers: z.array(FollowerSchema).optional(),
});

export const defaultMyCompProps: z.infer<typeof CompositionProps> = {
  followerCount: 1000,
  theme: "light",
};

export const RenderRequest = z.object({
  id: z.string(),
  inputProps: CompositionProps,
});

export const ProgressRequest = z.object({
  bucketName: z.string(),
  id: z.string(),
});

export type ProgressResponse =
  | {
      type: "error";
      message: string;
    }
  | {
      type: "progress";
      progress: number;
    }
  | {
      type: "done";
      url: string;
      size: number;
    };
