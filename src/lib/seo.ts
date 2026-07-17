import type { Metadata } from "next";

/**
 * Central SEO helpers — canonical URLs, hreflang alternates and per-page
 * OpenGraph. ne is the default locale served at "/" (localePrefix "as-needed");
 * en is served under "/en". Every indexable page should call `pageSeo()` in its
 * `generateMetadata` so Google gets an explicit canonical + hreflang set instead
 * of guessing between the ne and en variants.
 */

export const SITE_URL = "https://ssf.digitalsolutionnepal.com";

/** Absolute URL for a locale + path. `path` must start with "/" (or be ""). */
export function absoluteUrl(locale: string, path = ""): string {
  const clean = path === "/" ? "" : path;
  return locale === "en" ? `${SITE_URL}/en${clean}` : `${SITE_URL}${clean}`;
}

/**
 * Canonical + hreflang alternates for a page. `path` is the locale-agnostic
 * path (e.g. "/blog/xyz", "" for home). x-default points at the Nepali (default)
 * variant per Google's guidance for the primary audience.
 */
export function alternatesFor(locale: string, path = ""): NonNullable<Metadata["alternates"]> {
  const clean = path === "/" ? "" : path;
  return {
    canonical: absoluteUrl(locale, clean),
    languages: {
      ne: `${SITE_URL}${clean}`,
      en: `${SITE_URL}/en${clean}`,
      "x-default": `${SITE_URL}${clean}`,
    },
  };
}

interface PageSeoInput {
  locale: string;
  path?: string;
  title?: string;
  description?: string;
  /** "website" (default) or "article" for guides/blog posts. */
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  /** Path to a custom OG image; falls back to the site default. */
  image?: string;
}

/**
 * One call that returns title + description + canonical/hreflang for a page.
 *
 * We deliberately do NOT emit a page-level `openGraph`/`twitter` object unless a
 * custom `image` is supplied: setting one replaces the inherited card and, more
 * importantly, strips the file-based `opengraph-image.tsx` (the branded default
 * card) that Next.js otherwise merges in automatically. By only setting
 * `alternates` + title + description, Next still fills og/twitter title,
 * description and the default image for us. og:type=article is a minor signal
 * (the Article/BlogPosting JSON-LD already declares the real type to Google).
 */
export function pageSeo({
  locale,
  path = "",
  title,
  description,
  type = "website",
  publishedTime,
  modifiedTime,
  tags,
  image,
}: PageSeoInput): Metadata {
  const url = absoluteUrl(locale, path);
  const meta: Metadata = {
    ...(title ? { title } : {}),
    ...(description ? { description } : {}),
    alternates: alternatesFor(locale, path),
  };
  // Only take over the OG/Twitter cards when a page ships its own image;
  // otherwise let the inherited default (branded) card stand.
  if (image) {
    meta.openGraph = {
      type: type === "article" ? "article" : "website",
      url,
      siteName: "SSF Guide Nepal",
      locale: locale === "en" ? "en_US" : "ne_NP",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [{ url: image }],
      ...(type === "article"
        ? {
            ...(publishedTime ? { publishedTime } : {}),
            ...(modifiedTime ? { modifiedTime } : {}),
            ...(tags && tags.length ? { tags } : {}),
          }
        : {}),
    };
    meta.twitter = {
      card: "summary_large_image",
      ...(title ? { title } : {}),
      ...(description ? { description } : {}),
      images: [image],
    };
  }
  return meta;
}
