import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { translations } from "./translations";

const LanguageContext = createContext(null);

const SWITCH_DELAY = 700;

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState("en");
  const [isSwitching, setIsSwitching] = useState(false);

  const changeLanguage = useCallback(
    (next) => {
      if (next === lang || isSwitching) return;

      // Full-screen loader hides the reflow while the copy length changes.
      setIsSwitching(true);
      window.setTimeout(() => {
        setLang(next);
        document.documentElement.lang = next;
        window.setTimeout(() => setIsSwitching(false), SWITCH_DELAY / 2);
      }, SWITCH_DELAY / 2);
    },
    [lang, isSwitching]
  );

  const value = useMemo(
    () => ({ lang, t: translations[lang], isSwitching, changeLanguage }),
    [lang, isSwitching, changeLanguage]
  );

  return (
    <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used inside LanguageProvider");
  return ctx;
}
