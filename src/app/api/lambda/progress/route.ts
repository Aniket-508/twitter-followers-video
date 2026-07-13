import type { AwsRegion } from "@remotion/lambda/client";
import {
  speculateFunctionName,
  getRenderProgress,
} from "@remotion/lambda/client";

import { executeApi } from "@/helpers/api-response";
import type { ProgressResponse } from "@/types/schema";
import { ProgressRequest } from "@/types/schema";

import { DISK, RAM, REGION, TIMEOUT } from "../../../../../config.mjs";

export const POST = executeApi<ProgressResponse, typeof ProgressRequest>(
  ProgressRequest,
  async (req, body) => {
    const renderProgress = await getRenderProgress({
      bucketName: body.bucketName,
      functionName: speculateFunctionName({
        diskSizeInMb: DISK,
        memorySizeInMb: RAM,
        timeoutInSeconds: TIMEOUT,
      }),
      region: REGION as AwsRegion,
      renderId: body.id,
    });

    if (renderProgress.fatalErrorEncountered) {
      return {
        message: renderProgress.errors[0].message,
        type: "error",
      };
    }

    if (renderProgress.done) {
      return {
        size: renderProgress.outputSizeInBytes as number,
        type: "done",
        url: renderProgress.outputFile as string,
      };
    }

    return {
      progress: Math.max(0.03, renderProgress.overallProgress),
      type: "progress",
    };
  }
);
