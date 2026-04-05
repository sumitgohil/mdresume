export type SeoType = "website" | "article";

export type SeoProps = {
  title?: string;
  description?: string;
  image?: string;
  imageAlt?: string;
  locale?: string;
  type?: SeoType;
  publishedTime?: string | Date;
  modifiedTime?: string | Date;
  noIndex?: boolean;
  disableDefaultSchema?: boolean;
};

export type BreadcrumbItem = {
  name: string;
  path: string;
};

export type BlogPostingInput = {
  pathname: string;
  title: string;
  description: string;
  publishDate: string | Date;
  modifiedDate?: string | Date;
  tags?: string[];
};

export const SITE = {
  name: "MDResume",
  origin: "https://mdresume.dev",
  description:
    "Open-source Markdown resume builder with ATS-friendly resume templates, AI resume review tools, live previews, and a browser-first editor.",
  author: "Sumit Gohil",
  defaultLocale: "en",
  ogWidth: 1200,
  ogHeight: 630,
};

const LOCALE_TO_OG: Record<string, string> = {
  en: "en_US",
  "en-US": "en_US",
};

function toIsoDate(value?: string | Date) {
  if (!value) return undefined;
  return value instanceof Date ? value.toISOString() : new Date(value).toISOString();
}

export function normalizePath(pathname = "/") {
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

export function getOgLocale(locale = SITE.defaultLocale) {
  return LOCALE_TO_OG[locale] || locale.replace("-", "_");
}

export function getOgImageFilename(pathname = "/", locale = SITE.defaultLocale) {
  const path = normalizePath(pathname);
  const slug =
    path === "/"
      ? "home"
      : path
          .replace(/^\/|\/$/g, "")
          .replace(/[^\w/-]+/g, "-")
          .replace(/\//g, "--")
          .toLowerCase();
  return `${locale}-${slug}`;
}

export function getOgImageUrl({
  image,
  pathname = "/",
  locale = SITE.defaultLocale,
  origin = SITE.origin,
}: {
  image?: string;
  pathname?: string;
  locale?: string;
  origin?: string;
} = {}) {
  if (image) return new URL(image, origin).toString();
  return `${origin}/_og/${getOgImageFilename(pathname, locale)}.png`;
}

export function getImageAlt(title?: string, imageAlt?: string) {
  return imageAlt || `${getSeoTitle(title)} preview`;
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
    inLanguage: "en",
  };
}

export function webApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: SITE.name,
    alternateName: "Markdown Resume",
    applicationCategory: "BusinessApplication",
    applicationSubCategory: "Resume Builder",
    operatingSystem: "Any",
    browserRequirements: "Requires a modern web browser.",
    url: `${SITE.origin}/editor`,
    isAccessibleForFree: true,
    featureList: [
      "Markdown resume editor",
      "ATS-friendly resume templates",
      "PDF resume export",
      "BYOK AI resume review",
      "Job description keyword checks",
      "Cover letter drafting",
    ],
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

export function softwareApplicationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: SITE.name,
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    url: SITE.origin,
    description: SITE.description,
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
    },
  };
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: getCanonicalUrl(item.path),
    })),
  };
}

export function blogPostingSchema(input: BlogPostingInput) {
  const url = getCanonicalUrl(input.pathname);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: input.title,
    description: getSeoDescription(input.description),
    url,
    mainEntityOfPage: url,
    datePublished: toIsoDate(input.publishDate),
    dateModified: toIsoDate(input.modifiedDate || input.publishDate),
    keywords: input.tags?.join(", "),
    author: {
      "@type": "Person",
      name: SITE.author,
    },
    publisher: {
      "@type": "Organization",
      name: SITE.name,
      url: SITE.origin,
    },
  };
}
