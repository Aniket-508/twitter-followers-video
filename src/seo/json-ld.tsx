import { LINK, SITE } from "@/constants";

const WebsiteJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.NAME,
    url: SITE.URL,
    description: SITE.DESCRIPTION,
    inLanguage: "en-US",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE.URL}?search={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const OrganizationJsonLd = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.NAME,
    url: SITE.URL,
    logo: `${SITE.URL}${SITE.OG_IMAGE}`,
    sameAs: [LINK.GITHUB, LINK.TWITTER],
    founder: {
      "@type": "Person",
      name: SITE.AUTHOR.NAME,
      url: SITE.AUTHOR.URL,
    },
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const FAQJsonLd = () => {
  const faqs = [
    {
      question: `What is ${SITE.NAME}?`,
      answer: `${SITE.NAME} is a free tool to generate beautiful animated videos to celebrate and share your Twitter/X follower milestones.`,
    },
    {
      question: `How do I use ${SITE.NAME}?`,
      answer: `Simply enter your follower count or upload a CSV with your followers' names and images, and we'll generate an animated video for you to download and share.`,
    },
    {
      question: `Is ${SITE.NAME} free to use?`,
      answer: `Yes! ${SITE.NAME} is completely free and open-source under the MIT license.`,
    },
    {
      question: "What technology is used?",
      answer: `The videos are generated using Remotion, a framework for creating videos with React.`,
    },
  ];

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
};

const JsonLdScripts = () => {
  return (
    <>
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      <FAQJsonLd />
    </>
  );
};

export { JsonLdScripts, WebsiteJsonLd, OrganizationJsonLd, FAQJsonLd };
