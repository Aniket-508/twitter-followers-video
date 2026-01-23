import { urlToName } from "./lib/url";

export const SOURCE_CODE_GITHUB_REPO = "twitter-followers-video";

export const SITE = {
  NAME: "Twitter Followers Video",
  URL: 'https://twitter-followers-video.vercel.app',
  OG_IMAGE: "/og.png",
  DESCRIPTION:
    "Generate beautiful animated videos to celebrate and share your Twitter/X follower milestones.",
  AUTHOR: {
    NAME: "Aniket Pawar",
    URL: "https://www.aniketpawar.com",
    EMAIL: "pawaraniket508@gmail.com",
    TWITTER: "@alaymanguy",
  },
  KEYWORDS: [
    "twitter",
    "x",
    "followers",
    "video",
    "animation",
    "remotion",
    "social media",
    "milestone",
    "celebration",
  ],
} as const;

export const LINK = {
  TWITTER: "https://x.com/@alaymanguy",
  GITHUB: "https://github.com/Aniket-508",
  SPONSOR: "https://github.com/sponsors/Aniket-508",
  LICENSE: "https://github.com/Aniket-508/twitter-followers-video/blob/main/LICENSE",
} as const

export const UTM_PARAMS = {
  utm_source: urlToName(SITE.URL),
} as const;
