'use client';

import React, { createContext, useContext, useMemo } from 'react';
import koMessages from '@/messages/ko/common.json';
import enMessages from '@/messages/en/common.json';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type SupportedLocale = 'ko' | 'en';

type Messages = typeof koMessages;

// A flat map of dot-separated keys to string values, e.g. "nav.browse" → "Browse"
type FlatMessages = Record<string, string>;

interface I18nContextValue {
  locale: SupportedLocale;
  t: (key: string) => string;
}

// ---------------------------------------------------------------------------
// Message flattening
// ---------------------------------------------------------------------------

function flattenMessages(obj: Record<string, unknown>, prefix = ''): FlatMessages {
  const result: FlatMessages = {};
  for (const key of Object.keys(obj)) {
    const value = obj[key];
    const flatKey = prefix ? `${prefix}.${key}` : key;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      Object.assign(result, flattenMessages(value as Record<string, unknown>, flatKey));
    } else {
      result[flatKey] = String(value);
    }
  }
  return result;
}

const FLAT_MESSAGES: Record<SupportedLocale, FlatMessages> = {
  ko: flattenMessages(koMessages as unknown as Record<string, unknown>),
  en: flattenMessages(enMessages as unknown as Record<string, unknown>),
};

// ---------------------------------------------------------------------------
// Context
// ---------------------------------------------------------------------------

const I18nContext = createContext<I18nContextValue | null>(null);

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface I18nProviderProps {
  locale: SupportedLocale;
  children: React.ReactNode;
}

export function I18nProvider({ locale, children }: I18nProviderProps) {
  const value = useMemo<I18nContextValue>(() => {
    const messages = FLAT_MESSAGES[locale] ?? FLAT_MESSAGES.ko;

    function t(key: string): string {
      return messages[key] ?? key;
    }

    return { locale, t };
  }, [locale]);

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

// ---------------------------------------------------------------------------
// Hook
// ---------------------------------------------------------------------------

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) {
    throw new Error('useI18n must be used inside <I18nProvider>');
  }
  return ctx;
}
