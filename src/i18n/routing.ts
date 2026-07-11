import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ne", "en"],
  defaultLocale: "ne",
  // "/" = Nepali, "/en/..." = English (spec §1)
  localePrefix: "as-needed",
});

export type AppLocale = (typeof routing.locales)[number];
