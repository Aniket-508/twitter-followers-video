import { execFile } from "node:child_process";
import { mkdir, stat } from "node:fs/promises";
import { join } from "node:path";
import { randomUUID } from "node:crypto";
import { promisify } from "node:util";
import type { z } from "zod";
import { AwsRegion } from "@remotion/lambda/client";
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
import { RenderRequest, RenderResponse } from "@/types/schema";
import { executeApi } from "@/helpers/api-response";
import { cookies } from "next/headers";
import { COOKIE_NAME, COOLDOWN_SECONDS } from "@/constants/remotion";

const execFileAsync = promisify(execFile);

const renderLocally = async (
  body: z.infer<typeof RenderRequest>,
): Promise<RenderResponse> => {
  const rendersDir = join(process.cwd(), "public", "renders");
  await mkdir(rendersDir, { recursive: true });

  const safeCompositionId = body.id.replace(/[^a-z0-9_-]/gi, "-");
  const fileName = `${safeCompositionId}-${Date.now()}-${randomUUID()}.mp4`;
  const outputLocation = join(rendersDir, fileName);

  try {
    await execFileAsync(
      join(process.cwd(), "node_modules", ".bin", "remotionb"),
      [
        "render",
        join(process.cwd(), "src/remotion/index.ts"),
        body.id,
        outputLocation,
        `--props=${JSON.stringify(body.inputProps)}`,
      ],
      {
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024 * 20,
      },
    );
  } catch (err) {
    const error = err as Error & { stderr?: string; stdout?: string };
    throw new Error(error.stderr || error.stdout || error.message);
  }

  const output = await stat(outputLocation);

  return {
    type: "done",
    url: `/renders/${fileName}`,
    size: output.size,
  };
};

export const POST = executeApi<RenderResponse, typeof RenderRequest>(
  RenderRequest,
  async (req, body) => {
    if (process.env.NODE_ENV === "development") {
      return renderLocally(body);
    }

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

    return {
      type: "lambda",
      renderId: result.renderId,
      bucketName: result.bucketName,
    };
  },
);
