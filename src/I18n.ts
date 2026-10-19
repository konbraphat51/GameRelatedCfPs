// vue-i18n setup; English is the default and the user's choice is remembered per browser.
import { createI18n } from "vue-i18n";
import en, { type MessageSchema } from "./Locales/En";
import ja from "./Locales/Ja";

/** Locales supported by the UI. */
export type AppLocale = "en" | "ja";

/** Every supported locale with its native display name. */
export const SUPPORTED_LOCALES: readonly { code: AppLocale; label: string }[] = [
  { code: "en", label: "English" },
  { code: "ja", label: "日本語" },
];

const STORAGE_KEY = "game-related-cfps:locale";

/** Maps a UI locale to the BCP 47 tag used for Intl date formatting. */
export function toIntlLocale(locale: string): string {
  return locale === "ja" ? "ja-JP" : "en-US";
}

/** Returns the stored locale, falling back to English when unavailable. */
function readStoredLocale(): AppLocale {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored === "ja" ? "ja" : "en";
  } catch {
    return "en";
  }
}

/** Persists the chosen locale; failures (e.g. private mode) are ignored. */
export function storeLocale(locale: AppLocale): void {
  try {
    window.localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    // Storage is optional.
  }
}

/** Locale active at startup. */
export const initialLocale: AppLocale = readStoredLocale();

/** Shared i18n instance installed into the Vue app. */
export const i18n = createI18n<[MessageSchema], AppLocale>({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: "en",
  messages: { en, ja },
});
