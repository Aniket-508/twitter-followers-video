import { urlToName } from "./url";

export const AUTHOR = {
  name: "Aniket Pawar",
  url: "https://www.aniketpawar.com",
  email: "pawaraniket508@gmail.com",
  twitter: "@alaymanguy",
};

export const SOURCE_CODE_GITHUB_REPO = "twitter-followers-video";
export const SOURCE_CODE_GITHUB_URL = `https://github.com/Aniket-508/${SOURCE_CODE_GITHUB_REPO}`;

export const SPONSORSHIP_URL = "https://github.com/sponsors/Aniket-508";

export const SITE = {
  name: "Twitter Followers Video",
  title: "Twitter Followers Video",
  description:
    "Generate beautiful animated videos to celebrate and share your Twitter/X follower milestones.",
  url: "https://twitter-followers-video.vercel.app",
  author: AUTHOR,
  links: {
    github: SOURCE_CODE_GITHUB_URL,
  },
  keywords: [
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

export const UTM_PARAMS = {
  utm_source: urlToName(SITE.url),
};
