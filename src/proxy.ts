import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextResponse } from "next/server";
import type { NextFetchEvent, NextRequest } from "next/server";

const hasRedisEnv =
  Boolean(process.env.UPSTASH_REDIS_REST_URL) &&
  Boolean(process.env.UPSTASH_REDIS_REST_TOKEN);

const ratelimit = hasRedisEnv
  ? new Ratelimit({
      analytics: true,
      // 10 requests per minute
      limiter: Ratelimit.fixedWindow(10, "1m"),
      prefix: "@followers-video/ratelimit",
      redis: Redis.fromEnv(),
    })
  : null;

export default async function middleware(
  request: NextRequest,
  context: NextFetchEvent
): Promise<Response | undefined> {
  if (process.env.NODE_ENV === "development" || !ratelimit) {
    return NextResponse.next();
  }

  const ip = request.headers.get("x-forwarded-for") ?? "127.0.0.1";

  const { success, pending, limit, remaining } = await ratelimit.limit(ip);

  context.waitUntil(pending);

  if (!success) {
    return NextResponse.json({ error: "Rate limited" }, { status: 429 });
  }

  const res = NextResponse.next();
  res.headers.set("X-RateLimit-Success", success.toString());
  res.headers.set("X-RateLimit-Limit", limit.toString());
  res.headers.set("X-RateLimit-Remaining", remaining.toString());

  return res;
}

export const config = {
  matcher: ["/api/render"],
};
