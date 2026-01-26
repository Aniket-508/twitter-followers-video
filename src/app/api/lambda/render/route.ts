import { AwsRegion, RenderMediaOnLambdaOutput } from "@remotion/lambda/client";
import {
  renderMediaOnLambda,
  speculateFunctionName,
} from "@remotion/lambda/client";
import {
  DISK,
  RAM,
  REGION,
  SITE_NAME,
  TIMEOUT,
} from "../../../../../config.mjs";
import { RenderRequest } from "@/types/schema";
import { executeApi } from "@/helpers/api-response";
import { cookies } from "next/headers";
import { COOKIE_NAME, COOLDOWN_SECONDS } from "@/types/constants";

export const POST = executeApi<RenderMediaOnLambdaOutput, typeof RenderRequest>(
  RenderRequest,
  async (req, body) => {
    if (
      !process.env.AWS_ACCESS_KEY_ID &&
      !process.env.REMOTION_AWS_ACCESS_KEY_ID
    ) {
      throw new TypeError(
        "Set up Remotion Lambda to render videos. See the README.md for how to do so.",
      );
    }
    if (
      !process.env.AWS_SECRET_ACCESS_KEY &&
      !process.env.REMOTION_AWS_SECRET_ACCESS_KEY
    ) {
      throw new TypeError(
        "The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing. Add it to your .env file.",
      );
    }

    const cookieStore = await cookies();
    const cooldownCookie = cookieStore.get(COOKIE_NAME);
    if (cooldownCookie) {
      throw new Error(
        "You recently rendered a video. Please wait a few minutes before rendering another one.",
      );
    }

    const result = await renderMediaOnLambda({
      codec: "h264",
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      serveUrl: SITE_NAME,
      composition: body.id,
      inputProps: body.inputProps,
      framesPerLambda: 10,
      downloadBehavior: {
        type: "download",
        fileName: "video.mp4",
      },
    });

    cookieStore.set(COOKIE_NAME, "true", {
      maxAge: COOLDOWN_SECONDS,
      path: "/",
      httpOnly: true,
      sameSite: "strict",
    });

    return result;
  },
);
