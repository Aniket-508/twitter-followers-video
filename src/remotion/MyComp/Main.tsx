import { z } from "zod";
import { CompositionProps } from "../../../types/constants";
import { FollowerAccumulation } from "./FollowerAccumulation";

export const Main = ({ followerCount }: z.infer<typeof CompositionProps>) => {
  return <FollowerAccumulation followerCount={followerCount} />;
};
