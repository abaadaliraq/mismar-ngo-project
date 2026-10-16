"use client";

import { createContext, useCallback, useContext, useLayoutEffect, useMemo, useSyncExternalStore, type ReactNode } from "react";
import { messages } from "./messages";

type Language = "en" | "ar";
type MessageKey = keyof typeof messages;
export type Translator = (key: MessageKey, values?: Record<string, string | number>) => string;
const storageKey = "abu-nawas-language";
let fallbackLanguage: Language = "en";
function readLanguage(): Language {
  try {
    const saved = localStorage.getItem(storageKey);
    return saved === "ar" || saved === "en" ? saved : fallbackLanguage;
  } catch { return fallbackLanguage; }
}
function subscribeLanguage(onChange: () => void) {
  window.addEventListener("abu-nawas-language-change", onChange);
  window.addEventListener("storage", onChange);
  return () => {
    window.removeEventListener("abu-nawas-language-change", onChange);
    window.removeEventListener("storage", onChange);
  };
}
const LanguageContext = createContext<{ language: Language; t: Translator; toggleLanguage: () => void } | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const language = useSyncExternalStore(subscribeLanguage, readLanguage, () => "en" as Language);
  useLayoutEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.title = messages.browserTitle[language].replace(/\n/g, " — ");
    document.querySelector('meta[name="description"]')?.setAttribute("content", messages.metaDescription[language].replace(/\n/g, " "));
  }, [language]);
  const t = useCallback<Translator>((key, values) => {
    const text = messages[key][language];
    return text.replace(/\{(\w+)\}/g, (token, name) => String(values?.[name] ?? token));
  }, [language]);
  const toggleLanguage = useCallback(() => {
    // Keep each existing scroll container in place across text reflow. No remount or navigation.
    const positions = Array.from(document.querySelectorAll<HTMLElement>(".presentation-shell, .slide-scroll, .lightbox-caption"))
      .map(element => ({ element, top: element.scrollTop, left: element.scrollLeft }));
    const next = language === "en" ? "ar" : "en";
    try { localStorage.setItem(storageKey, next); } catch { /* Optional persistence. */ }
    fallbackLanguage = next;
    window.dispatchEvent(new Event("abu-nawas-language-change"));
    requestAnimationFrame(() => {
      for (const { element, top, left } of positions) {
        const behavior = element.style.scrollBehavior;
        element.style.scrollBehavior = "auto";
        element.scrollTop = top;
        element.scrollLeft = left;
        element.style.scrollBehavior = behavior;
      }
    });
  }, [language]);
  const value = useMemo(() => ({ language, t, toggleLanguage }), [language, t, toggleLanguage]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) throw new Error("LanguageProvider is required");
  return context;
}
