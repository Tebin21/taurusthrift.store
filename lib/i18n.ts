import { getRequestConfig } from "next-intl/server";
import { routing } from "./routing";
import { getAdminLocale } from "./admin-locale";

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale) {
    // No [locale] URL segment matched => this is an admin (or root) route,
    // which next-intl's middleware never touches. Fall back to the
    // cookie-based admin locale and load the separate admin message bundle.
    const adminLocale = await getAdminLocale();
    return {
      locale: adminLocale,
      messages: (await import(`../messages/admin/${adminLocale}.json`)).default,
    };
  }

  if (!routing.locales.includes(locale as "en" | "ar" | "ku")) {
    locale = routing.defaultLocale;
  }

  return {
    locale,
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
