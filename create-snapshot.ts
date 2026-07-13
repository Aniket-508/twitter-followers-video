import { addBundleToSandbox, createSandbox } from "@remotion/vercel";
import { put } from "@vercel/blob";

import { bundleRemotionProject } from "./src/app/api/render/helpers";
import { getSnapshotBlobKey } from "./src/app/api/render/restore-snapshot";

const BUILD_DIR = ".remotion";

const main = async () => {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN;

  if (!blobToken) {
    throw new Error(
      "BLOB_READ_WRITE_TOKEN is not set. Attach a Vercel Blob store before creating the sandbox snapshot."
    );
  }

  const sandbox = await createSandbox({
    onProgress: ({ progress, message }) => {
      const pct = Math.round(progress * 100);
      console.log(`[create-snapshot] ${message} (${pct}%)`);
    },
  });

  try {
    console.log("[create-snapshot] Adding Remotion bundle...");
    bundleRemotionProject(BUILD_DIR);
    await addBundleToSandbox({ bundleDir: BUILD_DIR, sandbox });

    console.log("[create-snapshot] Taking snapshot...");
    const snapshot = await sandbox.snapshot({ expiration: 0 });

    await put(
      getSnapshotBlobKey(),
      JSON.stringify({ snapshotId: snapshot.snapshotId }),
      {
        access: "public",
        addRandomSuffix: false,
        contentType: "application/json",
        token: blobToken,
      }
    );

    console.log(
      `[create-snapshot] Snapshot saved: ${snapshot.snapshotId} (never expires)`
    );
  } finally {
    await sandbox.stop().catch((error: unknown) => {
      console.error("Failed to stop sandbox", error);
    });
  }
};

void main();
