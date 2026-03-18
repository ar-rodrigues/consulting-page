"use client";

import { useMemo } from "react";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

import styles from "./landing.module.css";

const SUPPORTED_LOCALES = ["es", "en"] as const;

type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

const localeLabels: Record<SupportedLocale, string> = {
  es: "ES",
  en: "EN",
};

function getLocaleFromPath(pathname: string): SupportedLocale {
  const parts = pathname.split("/");
  const maybeLocale = parts[1];
  if (maybeLocale === "es" || maybeLocale === "en") return maybeLocale;
  return "es";
}

export default function LanguageSwitcher() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentLocale = useMemo(
    () => getLocaleFromPath(pathname),
    [pathname],
  );

  const handleSwitch = (nextLocale: SupportedLocale) => {
    if (nextLocale === currentLocale) return;

    const parts = pathname.split("/");
    parts[1] = nextLocale;
    const nextPath = parts.join("/") || `/${nextLocale}`;

    const search = searchParams.toString();
    const url = search ? `${nextPath}?${search}` : nextPath;

    // Preserve hash (if any) to avoid losing in-page anchors.
    const hash = window.location.hash || "";
    router.push(`${url}${hash}`);
  };

  return (
    <div className={styles.langSwitcher} aria-label="Language switcher">
      {SUPPORTED_LOCALES.map((locale) => (
        <button
          key={locale}
          type="button"
          onClick={() => handleSwitch(locale)}
          className={`${styles.langBtn} ${
            locale === currentLocale ? styles.langBtnActive : ""
          }`}
          aria-current={locale === currentLocale ? "page" : undefined}
        >
          {localeLabels[locale]}
        </button>
      ))}
    </div>
  );
}

