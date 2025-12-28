import React, { createContext, useContext, useCallback, useMemo, useEffect } from 'react';
import { I18nManager } from 'react-native';
import { useSettingsStore } from '@/store';
import { translations, Language, Translations, LANGUAGES } from '@/localization';

interface LocalizationContextType {
  t: Translations;
  language: Language;
  isRTL: boolean;
  setLanguage: (lang: Language) => void;
  languages: typeof LANGUAGES;
}

const LocalizationContext = createContext<LocalizationContextType | undefined>(undefined);

export function LocalizationProvider({ children }: { children: React.ReactNode }) {
  const { language, setLanguage: storeSetLanguage } = useSettingsStore();
  
  const isRTL = useMemo(() => {
    return LANGUAGES.find(l => l.code === language)?.isRTL ?? true;
  }, [language]);

  const t = useMemo(() => {
    return translations[language] || translations.ar;
  }, [language]);

  const setLanguage = useCallback((lang: Language) => {
    storeSetLanguage(lang);
    
    // Handle RTL layout
    const langConfig = LANGUAGES.find(l => l.code === lang);
    if (langConfig) {
      const shouldBeRTL = langConfig.isRTL;
      if (I18nManager.isRTL !== shouldBeRTL) {
        I18nManager.allowRTL(shouldBeRTL);
        I18nManager.forceRTL(shouldBeRTL);
        // Note: App needs restart for RTL changes to take full effect
      }
    }
  }, [storeSetLanguage]);

  // Set initial RTL state
  useEffect(() => {
    const langConfig = LANGUAGES.find(l => l.code === language);
    if (langConfig) {
      I18nManager.allowRTL(langConfig.isRTL);
      I18nManager.forceRTL(langConfig.isRTL);
    }
  }, []);

  const value = useMemo(() => ({
    t,
    language,
    isRTL,
    setLanguage,
    languages: LANGUAGES,
  }), [t, language, isRTL, setLanguage]);

  return (
    <LocalizationContext.Provider value={value}>
      {children}
    </LocalizationContext.Provider>
  );
}

export function useLocalization() {
  const context = useContext(LocalizationContext);
  if (!context) {
    throw new Error('useLocalization must be used within a LocalizationProvider');
  }
  return context;
}

// Helper hook for text alignment based on language
export function useTextAlign() {
  const { isRTL } = useLocalization();
  return {
    textAlign: isRTL ? 'right' : 'left' as const,
    writingDirection: isRTL ? 'rtl' : 'ltr' as const,
  };
}
