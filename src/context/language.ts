import { createContext, useContext } from 'react';
import type { Copy, Language } from '../copy';

export interface LanguageContextValue {
  language: Language;
  copy: Copy;
  setLanguage: (language: Language) => void;
}

export const LanguageContext = createContext<LanguageContextValue | null>(null);

export function useLanguage(): LanguageContextValue {
  const value = useContext(LanguageContext);
  if (!value) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }

  return value;
}
