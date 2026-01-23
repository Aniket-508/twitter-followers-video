import { z } from "zod";
import { CompositionProps } from "@/types/constants";
import { FollowerAccumulation } from "./FollowerAccumulation";

export const Main = ({ followerCount, theme }: z.infer<typeof CompositionProps>) => {
  return <FollowerAccumulation followerCount={followerCount} theme={theme} />;
};
