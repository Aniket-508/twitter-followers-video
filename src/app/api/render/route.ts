import { execFile } from "node:child_process";
import { randomUUID } from "node:crypto";
import { mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { promisify } from "node:util";

import { waitUntil } from "@vercel/functions";
import type { z } from "zod";

import { RenderRequest } from "@/types/schema";

import type { RenderProgress } from "./helpers";
import { bundleRemotionProject, formatSSE } from "./helpers";
import { restoreSnapshot } from "./restore-snapshot";

const execFileAsync = promisify(execFile);
const BUILD_DIR = ".remotion";

const isSafeFileNameChar = (char: string) => {
  const code = char.codePointAt(0) ?? 0;
  const isNumber = code >= 48 && code <= 57;
  const isUppercaseLetter = code >= 65 && code <= 90;
  const isLowercaseLetter = code >= 97 && code <= 122;
  return (
    isNumber ||
    isUppercaseLetter ||
    isLowercaseLetter ||
    char === "_" ||
    char === "-"
  );
};

const getSafeFileName = (compositionId: string) => {
  const safeCompositionId = [...compositionId]
    .map((char) => (isSafeFileNameChar(char) ? char : "-"))
    .join("");
  return `${safeCompositionId}-${Date.now()}-${randomUUID()}.mp4`;
};

const renderLocally = async ({
  body,
  send,
}: {
  body: z.infer<typeof RenderRequest>;
  send: (message: RenderProgress) => Promise<void>;
}) => {
  await send({
    phase: "Preparing local render...",
    progress: 0,
    type: "phase",
  });

  const rendersDir = path.join(process.cwd(), "public", "renders");
  await mkdir(rendersDir, { recursive: true });

  const fileName = getSafeFileName(body.id);
  const outputLocation = path.join(rendersDir, fileName);

  await send({
    phase: "Rendering video locally...",
    progress: 0.1,
    type: "phase",
  });

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
  await send({
    size: output.size,
    type: "done",
    url: `/renders/${fileName}`,
  });
};

const renderOnVercel = async ({
  body,
  send,
}: {
  body: z.infer<typeof RenderRequest>;
  send: (message: RenderProgress) => Promise<void>;
}) => {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Create and attach a Vercel Blob store, then expose BLOB_READ_WRITE_TOKEN to the project."
    );
  }

  const {
    addBundleToSandbox,
    createSandbox,
    renderMediaOnVercel,
    uploadToVercelBlob,
  } = await import("@remotion/vercel");

  await send({ phase: "Creating sandbox...", progress: 0, type: "phase" });

  const sandbox = process.env.VERCEL
    ? await restoreSnapshot()
    : await createSandbox({
        onProgress: async ({ progress, message }) => {
          await send({
            phase: message,
            progress,
            subtitle: "This is only needed outside Vercel deployments.",
            type: "phase",
          });
        },
      });

  try {
    if (!process.env.VERCEL) {
      bundleRemotionProject(BUILD_DIR);
      await addBundleToSandbox({ bundleDir: BUILD_DIR, sandbox });
    }

    const { sandboxFilePath, contentType } = await renderMediaOnVercel({
      codec: "h264",
      compositionId: body.id,
      inputProps: body.inputProps,
      onProgress: async (update) => {
        switch (update.stage) {
          case "opening-browser": {
            await send({
              phase: "Opening browser...",
              progress: update.overallProgress,
              type: "phase",
            });
            break;
          }
          case "selecting-composition": {
            await send({
              phase: "Selecting composition...",
              progress: update.overallProgress,
              type: "phase",
            });
            break;
          }
          case "render-progress": {
            await send({
              phase: "Rendering video...",
              progress: update.overallProgress,
              type: "phase",
            });
            break;
          }
          default: {
            break;
          }
        }
      },
      sandbox,
    });

    await send({ phase: "Uploading video...", progress: 1, type: "phase" });

    const { url, size } = await uploadToVercelBlob({
      access: "public",
      blobToken,
      contentType,
      sandbox,
      sandboxFilePath,
    });

    await send({ size, type: "done", url });
  } finally {
    await sandbox.stop().catch((error: unknown) => {
      console.error("Failed to stop sandbox", error);
    });
  }
};

export const POST = async (req: Request) => {
  const payload = await req.json();
  const body = RenderRequest.parse(payload);

  const encoder = new TextEncoder();
  const stream = new TransformStream();
  const writer = stream.writable.getWriter();

  const send = async (message: RenderProgress) => {
    await writer.write(encoder.encode(formatSSE(message)));
  };

  const runRender = async () => {
    try {
      if (process.env.NODE_ENV === "development") {
        await renderLocally({ body, send });
        return;
      }

      await renderOnVercel({ body, send });
    } catch (error) {
      await send({ message: (error as Error).message, type: "error" });
    } finally {
      await writer.close();
    }
  };

  waitUntil(runRender());

  return new Response(stream.readable, {
    headers: {
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "Content-Type": "text/event-stream",
    },
  });
};
