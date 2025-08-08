import { useMemo } from 'react';

import type { ThemeVariant } from '@/stores/useThemeStore';

import { createThemeTexts, type ThemeTextSystem } from './text';
import { getThemeConfig } from './utils';

export interface ThemeContext {
  variant: ThemeVariant;
  config: ReturnType<typeof getThemeConfig>;
  isCRT: boolean;
  isLight: boolean;
  isModern: boolean;
  texts: ThemeTextSystem;
}

export const useThemeContext = (variant: ThemeVariant): ThemeContext => {
  return useMemo(() => {
    const config = getThemeConfig(variant);
    const isCRT = config.type === 'crt';
    const isLight = config.type === 'light';
    const isModern = config.type === 'modern';
    const texts = createThemeTexts(isCRT);

    return {
      variant,
      config,
      isCRT,
      isLight,
      isModern,
      texts,
    };
  }, [variant]);
};
