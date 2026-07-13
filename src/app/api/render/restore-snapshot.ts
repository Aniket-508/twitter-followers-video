import { get } from "@vercel/blob";
import { Sandbox } from "@vercel/sandbox";

const SANDBOX_CREATING_TIMEOUT = 5 * 60 * 1000;

export const getSnapshotBlobKey = () =>
  `snapshot-cache/${process.env.VERCEL_DEPLOYMENT_ID ?? "local"}.json`;

export const restoreSnapshot = async () => {
  const blob = await get(getSnapshotBlobKey(), {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  if (!blob) {
    throw new Error(
      "No sandbox snapshot found. Run `bun run create-snapshot` as part of the build process."
    );
  }

  const response = new Response(blob.stream);
  const cache: { snapshotId?: string } = await response.json();

  if (!cache.snapshotId) {
    throw new Error(
      "No sandbox snapshot found. Run `bun run create-snapshot` as part of the build process."
    );
  }

  return Sandbox.create({
    source: { snapshotId: cache.snapshotId, type: "snapshot" },
    timeout: SANDBOX_CREATING_TIMEOUT,
  });
};
