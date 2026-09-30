import { NextResponse } from "next/server";

import type { FetchedProfile } from "@/lib/followers-api";
import {
  FOLLOWERS_PAGE_SIZE,
  HANDLE_PATTERN,
  normalizeHandle,
} from "@/lib/followers-api";
import type { Follower } from "@/types/schema";

const FXTWITTER_BASE = "https://api.fxtwitter.com";

interface FxProfile {
  name?: string;
  screen_name?: string;
  followers?: number;
}

interface FxFollower {
  name?: string;
  screen_name?: string;
  avatar_url?: string | null;
  verification?: { verified?: boolean };
}

interface FxFollowersResponse {
  results?: FxFollower[];
  cursor?: { bottom?: string | null } | null;
}

interface FxMessageResponse {
  message?: string;
}

const mapFollower = (raw: FxFollower): Follower => ({
  image: raw.avatar_url || undefined,
  name: raw.name || raw.screen_name || "Unknown",
  verified: Boolean(raw.verification?.verified),
});

const upstreamError = async (
  response: Response,
  fallback: string,
  secondary?: Response | null
): Promise<NextResponse> => {
  const body = (await response
    .json()
    .catch(() => null)) as FxMessageResponse | null;
  const secondaryBody =
    secondary && !secondary.ok
      ? ((await secondary.json().catch(() => null)) as FxMessageResponse | null)
      : null;
  const status = response.status === 404 ? 404 : 502;
  return NextResponse.json(
    { message: body?.message || secondaryBody?.message || fallback },
    { status }
  );
};

export const GET = async (request: Request): Promise<NextResponse> => {
  const { searchParams } = new URL(request.url);
  const handle = normalizeHandle(searchParams.get("handle") ?? "");
  const cursor = searchParams.get("cursor");

  if (!HANDLE_PATTERN.test(handle)) {
    return NextResponse.json(
      {
        message: "Enter a valid X username (letters, numbers or underscores).",
      },
      { status: 400 }
    );
  }

  const followersUrl = new URL(
    `${FXTWITTER_BASE}/2/profile/${handle}/followers`
  );
  followersUrl.searchParams.set("count", String(FOLLOWERS_PAGE_SIZE));
  if (cursor) {
    followersUrl.searchParams.set("cursor", cursor);
  }
  const profileUrl = `${FXTWITTER_BASE}/2/profile/${handle}`;

  try {
    const [followersResponse, profileResponse] = await Promise.all([
      fetch(followersUrl, { headers: { accept: "application/json" } }),
      cursor
        ? Promise.resolve<Response | null>(null)
        : fetch(profileUrl, { headers: { accept: "application/json" } }),
    ]);

    if (!followersResponse.ok) {
      return upstreamError(
        followersResponse,
        "Could not fetch followers for this account.",
        profileResponse
      );
    }

    const body = (await followersResponse.json()) as FxFollowersResponse;
    const followers = (body.results ?? []).map(mapFollower);
    const nextCursor = body.cursor?.bottom ?? null;

    let profile: FetchedProfile | undefined;
    const profileBody = profileResponse?.ok
      ? ((await profileResponse.json().catch(() => null)) as {
          user?: FxProfile;
        } | null)
      : null;
    const user = profileBody?.user;
    if (user) {
      profile = {
        followerCount:
          typeof user.followers === "number" ? user.followers : undefined,
        name: user.name ?? handle,
        screenName: user.screen_name ?? handle,
      };
    }

    return NextResponse.json({ cursor: nextCursor, followers, profile });
  } catch {
    return NextResponse.json(
      { message: "The followers service is unreachable. Try again shortly." },
      { status: 502 }
    );
  }
};
