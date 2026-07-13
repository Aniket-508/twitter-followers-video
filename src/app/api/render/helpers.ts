import { execFileSync } from "node:child_process";
import path from "node:path";

export type RenderProgress =
  | { type: "phase"; phase: string; progress: number; subtitle?: string }
  | { type: "done"; url: string; size: number }
  | { type: "error"; message: string };

export const bundleRemotionProject = (bundleDir: string): void => {
  try {
    execFileSync(
      path.join(process.cwd(), "node_modules", ".bin", "remotionb"),
      [
        "bundle",
        path.join(process.cwd(), "src/remotion/index.ts"),
        "--out-dir",
        `./${bundleDir}`,
      ],
      {
        cwd: process.cwd(),
        stdio: "inherit",
      }
    );
  } catch (error) {
    const commandError = error as Error & { stderr?: Buffer };
    const stderr = commandError.stderr?.toString() ?? "";
    throw new Error(
      `Remotion bundle failed: ${stderr || commandError.message}`,
      { cause: error }
    );
  }
};

export const formatSSE = (message: RenderProgress): string =>
  `data: ${JSON.stringify(message)}\n\n`;
