import type { ThemeVariant } from './config';

export type ThemeGroup = {
  label: string;
  themes: ThemeVariant[];
};

export const THEME_GROUPS: ThemeGroup[] = [
  {
    label: 'CRT Themes',
    themes: ['green-crt', 'amber-crt', 'blue-crt', 'purple-crt', 'red-crt'],
  },
];
