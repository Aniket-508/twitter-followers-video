import type { z } from "zod";

import type { ApiResponse } from "../helpers/api-response";
import type {
  CompositionProps,
  ProgressRequest,
  ProgressResponse,
  RenderResponse,
  RenderRequest,
} from "../types/schema";

const makeRequest = async <Res>(
  endpoint: string,
  body: unknown
): Promise<Res> => {
  const result = await fetch(endpoint, {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "post",
  });
  const json = (await result.json()) as ApiResponse<Res>;
  if (json.type === "error") {
    throw new Error(json.message);
  }

  return json.data;
};

export const renderVideo = ({
  id,
  inputProps,
}: {
  id: string;
  inputProps: z.infer<typeof CompositionProps>;
}) => {
  const body: z.infer<typeof RenderRequest> = {
    id,
    inputProps,
  };

  return makeRequest<RenderResponse>("/api/lambda/render", body);
};

export const getProgress = ({
  id,
  bucketName,
}: {
  id: string;
  bucketName: string;
}) => {
  const body: z.infer<typeof ProgressRequest> = {
    bucketName,
    id,
  };

  return makeRequest<ProgressResponse>("/api/lambda/progress", body);
};
