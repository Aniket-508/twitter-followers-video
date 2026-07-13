import type { z } from "zod";

import type {
  CompositionProps,
  RenderProgress,
  RenderRequest,
} from "@/types/schema";

const parseSSEMessages = (chunk: string): RenderProgress[] =>
  chunk
    .split("\n\n")
    .map((message) => message.trim())
    .filter(Boolean)
    .map((message) => {
      const dataLine = message
        .split("\n")
        .find((line) => line.startsWith("data: "));

      if (!dataLine) {
        return null;
      }

      return JSON.parse(dataLine.slice("data: ".length)) as RenderProgress;
    })
    .filter((message): message is RenderProgress => message !== null);

export const renderVideo = async ({
  id,
  inputProps,
  onProgress,
}: {
  id: string;
  inputProps: z.infer<typeof CompositionProps>;
  onProgress: (progress: RenderProgress) => void;
}) => {
  const body: z.infer<typeof RenderRequest> = {
    id,
    inputProps,
  };

  const response = await fetch("/api/render", {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
    },
    method: "post",
  });

  if (!response.ok) {
    throw new Error(`Render request failed with status ${response.status}`);
  }

  if (!response.body) {
    throw new Error("Render response did not include a stream.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  const readNextChunk = async (): Promise<void> => {
    const { done, value } = await reader.read();

    if (done) {
      return;
    }

    buffer += decoder.decode(value, { stream: true });
    const boundary = buffer.lastIndexOf("\n\n");

    if (boundary !== -1) {
      const complete = buffer.slice(0, boundary + 2);
      buffer = buffer.slice(boundary + 2);

      for (const message of parseSSEMessages(complete)) {
        onProgress(message);
      }
    }

    await readNextChunk();
  };

  await readNextChunk();

  buffer += decoder.decode();

  if (buffer.trim()) {
    for (const message of parseSSEMessages(`${buffer}\n\n`)) {
      onProgress(message);
    }
  }
};
