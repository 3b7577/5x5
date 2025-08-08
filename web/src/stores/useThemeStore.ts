import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ThemeVariant =
  | 'green-crt'
  | 'amber-crt'
  | 'blue-crt'
  | 'purple-crt'
  | 'red-crt'
  | 'green-light'
  | 'amber-light'
  | 'blue-light'
  | 'modern-dark';

interface IThemeStore {
  variant: ThemeVariant;
  setTheme: (variant: ThemeVariant) => void;
}

const useThemeStore = create<IThemeStore>()(
  persist(
    (set) => ({
      variant: 'green-crt',

      setTheme: (variant: ThemeVariant) => {
        set({ variant });
      },
    }),
    {
      name: 'theme-storage',
    },
  ),
);

export default useThemeStore;
