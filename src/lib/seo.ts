export type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  noIndex?: boolean;
  disableDefaultSchema?: boolean;
};

export const SITE = {
  name: "MDResume",
  origin: "https://mdresume.dev",
  description:
    "Open-source Markdown resume builder with polished templates, live previews, and a browser-first editor.",
  author: "Sumit Gohil",
  defaultImage: "/og-default.svg",
};

function normalizePath(pathname = "/") {
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (path.length > 1 && path.endsWith("/")) return path.slice(0, -1);
  return path;
}

export function getCanonicalUrl(pathname = "/", origin = SITE.origin) {
  return new URL(normalizePath(pathname), origin).toString();
}

export function getSeoTitle(title?: string) {
  if (!title) return `${SITE.name} | Open-source Markdown Resume Builder`;
  if (title.includes(SITE.name) || title.includes("|")) return title;
  return `${title} | ${SITE.name}`;
}

export function getSeoDescription(description?: string) {
  const value = description?.trim() || SITE.description;
  return value.length <= 160 ? value : `${value.slice(0, 157).trim()}...`;
}

export function getImageUrl(image?: string, origin = SITE.origin) {
  return new URL(image || SITE.defaultImage, origin).toString();
}

export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.author,
    url: SITE.origin,
  };
}

export function webPageSchema(pathname = "/", title?: string, description?: string) {
  const url = getCanonicalUrl(pathname);
  return {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: getSeoTitle(title),
    description: getSeoDescription(description),
    url,
    isPartOf: {
      "@type": "WebSite",
      name: SITE.name,
      url: SITE.origin,
    },
  };
}

export function webSiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.origin,
    description: SITE.description,
  };
}

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Any",
    url: SITE.origin,
    creator: {
      "@type": "Person",
      name: SITE.author,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function faqSchema(items: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}
