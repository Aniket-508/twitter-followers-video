import { z } from "zod";
import { CompositionProps } from "@/types/constants";
import { FollowerAccumulation } from "./follower-accumulation";

export const Main = ({
  followerCount,
  theme,
  followers,
}: z.infer<typeof CompositionProps>) => {
  return (
    <FollowerAccumulation
      followerCount={followerCount}
      theme={theme}
      followers={followers}
    />
  );
};
