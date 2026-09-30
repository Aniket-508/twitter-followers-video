import { z } from "zod";

import { FollowerSchema } from "@/types/schema";

/** Hard cap on followers loaded via fetch + "Load more". */
export const FETCH_MAX_FOLLOWERS = 1000;
/** Page size requested from the followers service. */
export const FOLLOWERS_PAGE_SIZE = 100;

export const HANDLE_PATTERN = /^[A-Za-z0-9_]{1,15}$/u;

export const normalizeHandle = (value: string): string =>
  value.trim().replace(/^@/u, "");

export const isValidHandle = (value: string): boolean =>
  HANDLE_PATTERN.test(normalizeHandle(value));

const FetchedProfileSchema = z.object({
  followerCount: z.number().optional(),
  name: z.string(),
  screenName: z.string(),
});

const FollowersPageSchema = z.object({
  cursor: z.string().nullable(),
  followers: z.array(FollowerSchema),
  profile: FetchedProfileSchema.optional(),
});

export type FetchedProfile = z.infer<typeof FetchedProfileSchema>;
type FollowersPage = z.infer<typeof FollowersPageSchema>;

/**
 * Fetches a single page of followers through the local API route proxy.
 * Throws a user-facing error message when the request fails.
 */
export const requestFollowersPage = async (
  handle: string,
  cursor?: string | null
): Promise<FollowersPage> => {
  const params = new URLSearchParams({ handle: normalizeHandle(handle) });
  if (cursor) {
    params.set("cursor", cursor);
  }

  let response: Response;
  try {
    response = await fetch(`/api/followers?${params.toString()}`);
  } catch {
    throw new Error(
      "Could not reach the followers service. Check your connection."
    );
  }

  const data: unknown = await response.json().catch(() => null);

  if (!response.ok) {
    const message =
      data && typeof data === "object" && "message" in data
        ? String((data as { message: unknown }).message)
        : "";
    throw new Error(message || `Followers request failed (${response.status})`);
  }

  const parsed = FollowersPageSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error("The followers service returned an unexpected response.");
  }

  return { ...parsed.data, cursor: parsed.data.cursor ?? null };
};
