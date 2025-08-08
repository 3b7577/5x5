const TEXT_DICTIONARY = {
  systemReset: { crt: '>> SYSTEM RESET <<', modern: 'System Reset' },
  clearingMemory: { crt: '>> CLEARING MEMORY <<', modern: 'Clearing Memory' },
  resetComplete: { crt: '>> RESET COMPLETE <<', modern: 'Reset Complete' },
  loadingPatterns: {
    crt: '>> LOADING PATTERNS <<',
    modern: 'Loading Patterns',
  },
  scanningMatrix: { crt: '>> SCANNING MATRIX <<', modern: 'Scanning Matrix' },
  flushingData: {
    crt: 'FLUSHING ALL FILTER DATA...',
    modern: 'Flushing all filter data...',
  },
  purgingSelections: {
    crt: 'PURGING ACTIVE SELECTIONS...',
    modern: 'Purging active selections...',
  },
  filtersCleared: {
    crt: 'ALL FILTERS CLEARED SUCCESSFULLY',
    modern: 'All filters cleared successfully',
  },
  initializingDb: {
    crt: 'INITIALIZING PATTERN DATABASE...',
    modern: 'Initializing pattern database...',
  },
  appTitle: { crt: '>> 5X5 PATTERNS <<', modern: '5×5 Patterns' },
  patterns: { crt: 'PATTERNS', modern: 'patterns' },
  filtersTitle: { crt: '<< FILTERS >>', modern: 'Filters' },
  refineSearch: { crt: 'REFINE YOUR SEARCH', modern: 'Refine your search' },
  pixelDensity: { crt: 'PIXEL DENSITY', modern: 'Pixel Density' },
  empty: { crt: 'EMPTY', modern: 'Empty' },
  full: { crt: 'FULL', modern: 'Full' },
  resetAll: { crt: '[RESET ALL]', modern: 'Reset All' },
  clearFilters: {
    crt: 'CLEAR ALL ACTIVE FILTERS',
    modern: 'Clear all active filters',
  },
  crtThemes: { crt: 'CRT THEMES', modern: 'CRT Themes' },
  lightThemes: { crt: 'LIGHT THEMES', modern: 'Light Themes' },
  modernThemes: { crt: 'MODERN', modern: 'Modern' },
} as const;

type TextKey = keyof typeof TEXT_DICTIONARY;

export type ThemeTexts = {
  [K in TextKey]: string;
};

export interface ThemeHelpers {
  filterBadge: (count: number) => string;
  tagCount: (count: number) => string;
  densityValues: (min: number, max: number) => { min: string; max: string };
  patternDensity: (density: number) => string;
  applyingFilters: (count: number) => string;
}

export type ThemeTextSystem = ThemeTexts & ThemeHelpers;

export const createThemeTexts = (isCRT: boolean): ThemeTextSystem => {
  const textType = isCRT ? 'crt' : 'modern';

  const texts = Object.keys(TEXT_DICTIONARY).reduce((acc, key) => {
    const textKey = key as TextKey;
    (acc as any)[textKey] = TEXT_DICTIONARY[textKey][textType];
    return acc;
  }, {} as ThemeTexts);

  const helpers: ThemeHelpers = {
    filterBadge: (count: number) => {
      const plural = count > 1 ? 'S' : '';
      return isCRT
        ? `[${count}] FILTER${plural} ACTIVE`
        : `${count} Filter${plural.toLowerCase()} Active`;
    },

    tagCount: (count: number) => (isCRT ? `${count} TAGS` : `${count} tags`),

    densityValues: (min: number, max: number) => ({
      min: isCRT ? `MIN: ${min.toString().padStart(2, '0')}` : `Min: ${min}`,
      max: isCRT ? `MAX: ${max.toString().padStart(2, '0')}` : `Max: ${max}`,
    }),

    patternDensity: (density: number) =>
      isCRT ? `${density.toString().padStart(2, '0')}/25` : `${density}/25`,

    applyingFilters: (count: number) => {
      const plural = count > 1 ? 's' : '';
      return isCRT
        ? `APPLYING [${count}] FILTER${plural.toUpperCase()}...`
        : `Applying ${count} filter${plural}...`;
    },
  };

  return { ...texts, ...helpers };
};
