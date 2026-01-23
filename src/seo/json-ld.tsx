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
      url: LINK.TWITTER,
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
      question: "What is heroicons-animated?",
      answer: `${SITE.NAME} is a free, open-source library of 316 beautifully crafted animated React icons. Built with Motion library and based on Heroicons.`,
    },
    {
      question: "How do I install heroicons-animated icons?",
      answer: `You can install icons using npx shadcn@latest add "${SITE.URL}/r/{icon-name}.json". Replace {icon-name} with the desired icon name in kebab-case.`,
    },
    {
      question: "Is heroicons-animated free to use?",
      answer: `Yes! ${SITE.NAME} is completely free and open-source under the MIT license. You can use it for personal and commercial projects.`,
    },
    {
      question: "What technologies are used in heroicons-animated?",
      answer: `${SITE.NAME} icons are React components written in TypeScript. Animations are powered by Motion (formerly Framer Motion), and the icons are based on Heroicons.`,
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
