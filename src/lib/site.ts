export const siteConfig = {
  name: "Twitter Followers Video",
  title: "Twitter Followers Video",
  description:
    "Generate beautiful animated videos to celebrate and share your Twitter/X follower milestones. Create viral follower accumulation animations with just a count!",
  shortDescription:
    "Generate beautiful animated videos to celebrate your Twitter/X follower milestones",
  url: "https://twitter-followers-video.vercel.app",
  author: {
    name: "Aniket Pawar",
    url: "https://www.aniketpawar.com",
    email: "pawaraniket508@gmail.com",
    twitter: "@alaymanguy",
  },
  links: {
    github: "https://github.com/Aniket-508/twitter-followers-video",
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

export type SiteConfig = typeof siteConfig;
