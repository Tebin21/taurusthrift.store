"use server";

import { cookies } from "next/headers";
import { routing, type Locale } from "@/lib/routing";

export async function getAdminLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("admin-locale")?.value;
  if (value && routing.locales.includes(value as Locale)) {
    return value as Locale;
  }
  return routing.defaultLocale;
}

export async function setAdminLocale(locale: Locale): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set("admin-locale", locale, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
  });
}
