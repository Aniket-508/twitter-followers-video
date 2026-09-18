import { Composition } from "remotion";

import {
  COMP_NAME,
  DURATION_IN_FRAMES,
  VIDEO_FPS,
  VIDEO_HEIGHT,
  VIDEO_WIDTH,
} from "@/constants/remotion";
import { Followers } from "@/remotion/followers";
import { defaultMyCompProps } from "@/types/schema";

export const RemotionRoot: React.FC = () => (
  <Composition
    id={COMP_NAME}
    component={Followers}
    durationInFrames={DURATION_IN_FRAMES}
    fps={VIDEO_FPS}
    width={VIDEO_WIDTH}
    height={VIDEO_HEIGHT}
    defaultProps={defaultMyCompProps}
  />
);
