export type ThemeVariant =
  | 'green-crt'
  | 'amber-crt'
  | 'blue-crt'
  | 'purple-crt'
  | 'red-crt';
export interface ThemeConfig {
  label: string;
  color: string;
  bgColor: string;
  pattern: number[][];
  loadingColors: {
    primary: string;
    secondary: string;
    background: string;
  };
  cssVars: {
    background: string;
    foreground: string;
    card: string;
    cardForeground: string;
    popover: string;
    popoverForeground: string;
    primary: string;
    primaryForeground: string;
    secondary: string;
    secondaryForeground: string;
    muted: string;
    mutedForeground: string;
    accent: string;
    accentForeground: string;
    destructive: string;
    destructiveForeground: string;
    border: string;
    input: string;
    ring: string;
    sidebar: string;
    sidebarForeground: string;
    sidebarPrimary: string;
    sidebarPrimaryForeground: string;
    sidebarAccent: string;
    sidebarAccentForeground: string;
    sidebarBorder: string;
    sidebarRing: string;
  };
}

export const THEME_CONFIGS: Record<ThemeVariant, ThemeConfig> = {
  'green-crt': {
    label: 'GREEN CRT',
    color: '#00ff41',
    bgColor: '#000800',
    pattern: [
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
      [0, 1, 0, 1, 0],
      [1, 0, 1, 0, 1],
    ],
    loadingColors: {
      primary: '#00ff41',
      secondary: '#00cc00',
      background: '#000800',
    },
    cssVars: {
      background: '#000800',
      foreground: '#00E676',

      card: '#001408',
      cardForeground: '#98ffcb',

      popover: '#001A0C',
      popoverForeground: '#98ffcb',

      primary: '#00FF41',
      primaryForeground: '#000800',

      secondary: '#073b18',
      secondaryForeground: '#7dffa9',

      muted: '#052e1a',
      mutedForeground: '#3bd37f',

      accent: '#00FFFF',
      accentForeground: '#001010',

      destructive: '#FF003C',
      destructiveForeground: '#000800',

      border: '#0c4d26',
      input: '#0c4d26',
      ring: '#00FF41',

      sidebar: '#001006',
      sidebarForeground: '#90ffb8',
      sidebarPrimary: '#00cc66',
      sidebarPrimaryForeground: '#000800',
      sidebarAccent: '#6A00FF',
      sidebarAccentForeground: '#000A0A',
      sidebarBorder: '#0c4d26',
      sidebarRing: '#00FF41',
    },
  },
  'amber-crt': {
    label: 'AMBER CRT',
    color: '#ffaa00',
    bgColor: '#0a0400',
    pattern: [
      [0, 1, 1, 1, 0],
      [1, 0, 1, 0, 1],
      [1, 1, 0, 1, 1],
      [1, 0, 1, 0, 1],
      [0, 1, 1, 1, 0],
    ],
    loadingColors: {
      primary: '#ffaa00',
      secondary: '#cc8800',
      background: '#0a0400',
    },
    cssVars: {
      background: '#0a0400',
      foreground: '#ffbb33',

      card: '#1a0d00',
      cardForeground: '#ffcc66',

      popover: '#1a0d00',
      popoverForeground: '#ffcc66',

      primary: '#ffaa00',
      primaryForeground: '#0a0400',

      secondary: '#442200',
      secondaryForeground: '#ffb84d',

      muted: '#221100',
      mutedForeground: '#aa7722',

      accent: '#fff066',
      accentForeground: '#0a0400',

      destructive: '#ff4040',
      destructiveForeground: '#0a0400',

      border: '#664400',
      input: '#332200',
      ring: '#ffaa00',

      sidebar: '#0a0400',
      sidebarForeground: '#ffcc66',
      sidebarPrimary: '#ffaa00',
      sidebarPrimaryForeground: '#0a0400',
      sidebarAccent: '#5c2e00',
      sidebarAccentForeground: '#ffb84d',
      sidebarBorder: '#664400',
      sidebarRing: '#ffaa00',
    },
  },
  'blue-crt': {
    label: 'BLUE CRT',
    color: '#4488ff',
    bgColor: '#000408',
    pattern: [
      [1, 1, 0, 1, 1],
      [1, 0, 0, 0, 1],
      [0, 0, 1, 0, 0],
      [1, 0, 0, 0, 1],
      [1, 1, 0, 1, 1],
    ],
    loadingColors: {
      primary: '#4488ff',
      secondary: '#2266cc',
      background: '#000408',
    },
    cssVars: {
      background: '#000408',
      foreground: '#66a3ff',

      card: '#001124',
      cardForeground: '#99c2ff',

      popover: '#001124',
      popoverForeground: '#99c2ff',

      primary: '#4488ff',
      primaryForeground: '#000408',

      secondary: '#002244',
      secondaryForeground: '#66a3ff',

      muted: '#001122',
      mutedForeground: '#3380cc',

      accent: '#00ddff',
      accentForeground: '#000408',

      destructive: '#ff4040',
      destructiveForeground: '#000408',

      border: '#224466',
      input: '#001830',
      ring: '#4488ff',

      sidebar: '#000408',
      sidebarForeground: '#99c2ff',
      sidebarPrimary: '#4488ff',
      sidebarPrimaryForeground: '#000408',
      sidebarAccent: '#003366',
      sidebarAccentForeground: '#66a3ff',
      sidebarBorder: '#224466',
      sidebarRing: '#4488ff',
    },
  },
  'purple-crt': {
    label: 'PURPLE CRT',
    color: '#cc88ff',
    bgColor: '#040008',
    pattern: [
      [0, 1, 0, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 0],
    ],
    loadingColors: {
      primary: '#cc88ff',
      secondary: '#aa66cc',
      background: '#040008',
    },
    cssVars: {
      background: '#040008',
      foreground: '#d4a6ff',

      card: '#110022',
      cardForeground: '#e0b8ff',

      popover: '#110022',
      popoverForeground: '#e0b8ff',

      primary: '#cc88ff',
      primaryForeground: '#040008',

      secondary: '#220044',
      secondaryForeground: '#d4a6ff',

      muted: '#110022',
      mutedForeground: '#a366cc',

      accent: '#ff88dd',
      accentForeground: '#040008',

      destructive: '#ff4040',
      destructiveForeground: '#040008',

      border: '#442266',
      input: '#1a0033',
      ring: '#cc88ff',

      sidebar: '#040008',
      sidebarForeground: '#e0b8ff',
      sidebarPrimary: '#cc88ff',
      sidebarPrimaryForeground: '#040008',
      sidebarAccent: '#330055',
      sidebarAccentForeground: '#d4a6ff',
      sidebarBorder: '#442266',
      sidebarRing: '#cc88ff',
    },
  },
  'red-crt': {
    label: 'RED CRT',
    color: '#ff4444',
    bgColor: '#080000',
    pattern: [
      [1, 1, 1, 1, 1],
      [1, 0, 0, 0, 1],
      [1, 0, 1, 0, 1],
      [1, 0, 0, 0, 1],
      [1, 1, 1, 1, 1],
    ],
    loadingColors: {
      primary: '#ff4444',
      secondary: '#cc2222',
      background: '#080000',
    },
    cssVars: {
      background: '#080000',
      foreground: '#ff6666',

      card: '#220000',
      cardForeground: '#ff9999',

      popover: '#220000',
      popoverForeground: '#ff9999',

      primary: '#ff4444',
      primaryForeground: '#080000',

      secondary: '#440000',
      secondaryForeground: '#ff6666',

      muted: '#220000',
      mutedForeground: '#cc5555',

      accent: '#ffaa44',
      accentForeground: '#080000',

      destructive: '#ff6666',
      destructiveForeground: '#080000',

      border: '#664444',
      input: '#330000',
      ring: '#ff4444',

      sidebar: '#080000',
      sidebarForeground: '#ff9999',
      sidebarPrimary: '#ff4444',
      sidebarPrimaryForeground: '#080000',
      sidebarAccent: '#550000',
      sidebarAccentForeground: '#ff6666',
      sidebarBorder: '#664444',
      sidebarRing: '#ff4444',
    },
  },
};
