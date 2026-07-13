import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import type { AwsRegion } from "@remotion/lambda/client";
import {
  renderMediaOnLambda,
  speculateFunctionName,
} from "@remotion/lambda/client";
import { cookies } from "next/headers";
import type { z } from "zod";

import { COOKIE_NAME, COOLDOWN_SECONDS } from "@/constants/remotion";
import { executeApi } from "@/helpers/api-response";
import type { RenderResponse } from "@/types/schema";
import { RenderRequest } from "@/types/schema";

import {
  DISK,
  RAM,
  REGION,
  SITE_NAME,
  TIMEOUT,
} from "../../../../../config.mjs";

const execFileAsync = promisify(execFile);

const renderLocally = async (
  body: z.infer<typeof RenderRequest>
): Promise<RenderResponse> => {
  const rendersDir = path.join(process.cwd(), "public", "renders");
  await mkdir(rendersDir, { recursive: true });

  const safeCompositionId = [...body.id]
    .map((char) => {
      const code = char.codePointAt(0) ?? 0;
      const isNumber = code >= 48 && code <= 57;
      const isUppercaseLetter = code >= 65 && code <= 90;
      const isLowercaseLetter = code >= 97 && code <= 122;
      return isNumber ||
        isUppercaseLetter ||
        isLowercaseLetter ||
        char === "_" ||
        char === "-"
        ? char
        : "-";
    })
    .join("");
  const fileName = `${safeCompositionId}-${Date.now()}-${randomUUID()}.mp4`;
  const outputLocation = path.join(rendersDir, fileName);

  try {
    await execFileAsync(
      path.join(process.cwd(), "node_modules", ".bin", "remotionb"),
      [
        "render",
        path.join(process.cwd(), "src/remotion/index.ts"),
        body.id,
        outputLocation,
        `--props=${JSON.stringify(body.inputProps)}`,
      ],
      {
        cwd: process.cwd(),
        maxBuffer: 1024 * 1024 * 20,
      }
    );
  } catch (error) {
    const commandError = error as Error & { stderr?: string; stdout?: string };
    throw new Error(
      commandError.stderr || commandError.stdout || commandError.message,
      { cause: error }
    );
  }

  const output = await stat(outputLocation);

  return {
    size: output.size,
    type: "done",
    url: `/renders/${fileName}`,
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
        "Set up Remotion Lambda to render videos. See the README.md for how to do so."
      );
    }
    if (
      !process.env.AWS_SECRET_ACCESS_KEY &&
      !process.env.REMOTION_AWS_SECRET_ACCESS_KEY
    ) {
      throw new TypeError(
        "The environment variable REMOTION_AWS_SECRET_ACCESS_KEY is missing. Add it to your .env file."
      );
    }

    const cookieStore = await cookies();
    const cooldownCookie = cookieStore.get(COOKIE_NAME);
    if (cooldownCookie) {
      throw new Error(
        "You recently rendered a video. Please wait a few minutes before rendering another one."
      );
    }

    const result = await renderMediaOnLambda({
      codec: "h264",
      composition: body.id,
      downloadBehavior: {
        fileName: "video.mp4",
        type: "download",
      },
      framesPerLambda: 10,
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      inputProps: body.inputProps,
      region: REGION as AwsRegion,
      serveUrl: SITE_NAME,
    });

    cookieStore.set(COOKIE_NAME, "true", {
      httpOnly: true,
      maxAge: COOLDOWN_SECONDS,
      path: "/",
      sameSite: "strict",
    });

    return {
      bucketName: result.bucketName,
      renderId: result.renderId,
      type: "lambda",
    };
  }
);
