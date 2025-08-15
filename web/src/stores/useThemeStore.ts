import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { THEME_CONFIGS, type ThemeConfig, type ThemeVariant } from '@/theme';

interface IThemeStore {
  variant: ThemeVariant;
  themeConfig: ThemeConfig;
  setTheme: (variant: ThemeVariant) => void;
}

const useThemeStore = create<IThemeStore>()(
  persist(
    (set) => ({
      variant: 'green-crt',
      themeConfig: THEME_CONFIGS['green-crt'],

      setTheme: (variant: ThemeVariant) => {
        set({ variant, themeConfig: THEME_CONFIGS[variant] });
      },
    }),
    {
      name: 'theme-storage',
    },
  ),
);

export default useThemeStore;
