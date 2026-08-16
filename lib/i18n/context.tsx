"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Locale, DEFAULT_LOCALE } from "./config";
import { getDictionary, Dictionary } from "./getDictionary";

interface LanguageContextType {
  locale: Locale;
  dictionary: Dictionary;
  setLocale: (newLocale: Locale) => void;
}

const LanguageContext = createContext<LanguageContextType>({
  locale: DEFAULT_LOCALE,
  dictionary: getDictionary(DEFAULT_LOCALE),
  setLocale: () => {},
});

export function LanguageProvider({
  initialLocale = DEFAULT_LOCALE,
  children,
}: {
  initialLocale?: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Detect locale from path or cookie
    if (pathname.startsWith("/kn")) {
      setLocaleState("kn");
    } else if (pathname.startsWith("/en")) {
      setLocaleState("en");
    }
  }, [pathname]);

  const setLocale = (newLocale: Locale) => {
    if (newLocale === locale) return;

    // Set cookie
    document.cookie = `NEXT_LOCALE=${newLocale}; path=/; max-age=31536000; SameSite=Lax`;

    setLocaleState(newLocale);

    // Compute new pathname with localized route
    let newPath = pathname;
    if (pathname.startsWith("/en") || pathname.startsWith("/kn")) {
      const segments = pathname.split("/").filter(Boolean);
      segments[0] = newLocale;
      newPath = "/" + segments.join("/");
    } else {
      newPath = `/${newLocale}${pathname === "/" ? "" : pathname}`;
    }

    router.push(newPath);
    router.refresh();
  };

  const dictionary = getDictionary(locale);

  return (
    <LanguageContext.Provider value={{ locale, dictionary, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
