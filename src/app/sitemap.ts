import type { MetadataRoute } from "next";
import { articles } from "@/content/articles";
import { faqs } from "@/content/faqs";
import { checklists } from "@/content/checklists";
import { categories } from "@/content/categories";
import { services } from "@/content/services";

const BASE = "https://ssf.digitalsolutionnepal.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticPaths = [
    "",
    "/school",
    "/faq",
    "/calculators",
    "/calculators/financial-planner",
    "/calculators/contribution",
    "/calculators/allocation",
    "/calculators/foreign-employment",
    "/calculators/job-leaving",
    "/assessment",
    "/checklists",
    "/downloads",
    "/services",
    "/sources",
    "/about",
    "/contact",
    "/donate",
    "/privacy",
    "/terms",
    "/disclaimer",
    "/report-correction",
  ];

  const urls: MetadataRoute.Sitemap = [];
  const add = (path: string, priority = 0.7) => {
    urls.push({
      url: `${BASE}${path}`,
      lastModified: new Date(),
      alternates: {
        languages: { ne: `${BASE}${path}`, en: `${BASE}/en${path}` },
      },
      priority,
    });
  };

  staticPaths.forEach((p) => add(p, p === "" ? 1 : 0.8));
  categories.forEach((c) => add(`/school/${c.slug}`));
  articles.forEach((a) => add(`/school/${a.categorySlug}/${a.slug}`, 0.9));
  faqs.forEach((f) => add(`/faq/${f.slug}`));
  checklists.forEach((c) => add(`/checklists/${c.slug}`));
  services.forEach((s) => add(`/services/${s.slug}`));

  return urls;
}
