import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { getCopy, getDefaultLanguage, type Language } from '../copy';
import { LanguageContext, type LanguageContextValue } from './language';

const storageKey = 'pixsmush-language';

function readStoredLanguage(): Language | null {
  if (typeof window === 'undefined') return null;

  const stored = window.localStorage.getItem(storageKey);
  return stored === 'en' || stored === 'zh' ? stored : null;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => readStoredLanguage() ?? getDefaultLanguage());

  useEffect(() => {
    window.localStorage.setItem(storageKey, language);
  }, [language]);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      copy: getCopy(language),
      setLanguage: setLanguageState,
    }),
    [language]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}
