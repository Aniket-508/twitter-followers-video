import { LINK, SITE } from "@/constants/site";

const WebsiteJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    description: SITE.DESCRIPTION,
    inLanguage: "en-US",
    name: SITE.NAME,
    potentialAction: {
      "@type": "SearchAction",
      "query-input": "required name=search_term_string",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.URL}?search={search_term_string}`,
      },
    },
    url: SITE.URL,
  };

  return <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>;
};

const OrganizationJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    founder: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: SITE.AUTHOR.URL,
    },
    logo: `${SITE.URL}${SITE.OG_IMAGE}`,
    name: SITE.NAME,
    sameAs: [LINK.GITHUB, LINK.TWITTER],
    url: SITE.URL,
  };

  return <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>;
};

const FAQJsonLd = () => {
  const faqs = [
    {
      answer: `${SITE.NAME} is a free tool to generate beautiful animated videos to celebrate and share your Twitter/X follower milestones.`,
      question: `What is ${SITE.NAME}?`,
    },
    {
      answer: `Simply enter your follower count or upload a CSV with your followers' names and images, and we'll generate an animated video for you to download and share.`,
      question: `How do I use ${SITE.NAME}?`,
    },
    {
      answer: `Yes! ${SITE.NAME} is completely free and open-source under the MIT license.`,
      question: `Is ${SITE.NAME} free to use?`,
    },
    {
      answer: `The videos are generated using Remotion, a framework for creating videos with React.`,
      question: "What technology is used?",
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
      name: faq.question,
    })),
  };

  return <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>;
};

const JsonLdScripts = () => (
  <>
    <WebsiteJsonLd />
    <OrganizationJsonLd />
    <FAQJsonLd />
  </>
);

export { JsonLdScripts, WebsiteJsonLd, OrganizationJsonLd, FAQJsonLd };
