import type { Metadata } from "next";

import { SITE } from "@/constants/site";

interface CreateMetadataOptions {
  title?: string;
  description?: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
}

const createMetadata = (options: CreateMetadataOptions = {}): Metadata => {
  const {
    title,
    description = SITE.DESCRIPTION,
    canonical,
    ogTitle,
    ogDescription,
    noIndex = false,
  } = options;

  return {
    ...(title && { title }),
    description,
    ...(canonical && {
      alternates: {
        canonical,
      },
    }),
    openGraph: {
      description: ogDescription || description,
      title: ogTitle || title || SITE.NAME,
      type: "website",
      url: canonical ? `${SITE.URL}${canonical}` : SITE.URL,
    },
    twitter: {
      description: ogDescription || description,
      title: ogTitle || title || SITE.NAME,
    },
    ...(noIndex && {
      robots: {
        follow: false,
        index: false,
      },
    }),
  };
};

const baseMetadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: SITE.NAME,
  },
  applicationName: SITE.NAME,
  authors: [{ name: SITE.AUTHOR.NAME, url: SITE.AUTHOR.URL }],
  category: "technology",
  creator: SITE.AUTHOR.NAME,
  description: SITE.DESCRIPTION,
  keywords: [...SITE.KEYWORDS],
  metadataBase: new URL(SITE.URL),
  openGraph: {
    description: SITE.DESCRIPTION,
    images: [
      {
        alt: `${SITE.NAME} - Generate animated videos for your X follower milestones`,
        height: 630,
        url: SITE.OG_IMAGE,
        width: 1200,
      },
    ],
    locale: "en_US",
    siteName: SITE.NAME,
    title: SITE.NAME,
    type: "website",
    url: SITE.URL,
  },
  publisher: SITE.AUTHOR.NAME,
  title: {
    default: SITE.NAME,
    template: `%s | ${SITE.NAME}`,
  },
  twitter: {
    card: "summary_large_image",
    creator: SITE.AUTHOR.TWITTER,
    description: SITE.DESCRIPTION,
    images: [
      {
        alt: `${SITE.NAME} - Generate animated videos for your X follower milestones`,
        height: 630,
        url: SITE.OG_IMAGE,
        width: 1200,
      },
    ],
    site: SITE.AUTHOR.TWITTER,
    title: SITE.NAME,
  },
};

export { baseMetadata, createMetadata };
