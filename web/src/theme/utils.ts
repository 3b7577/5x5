import { THEME_CONFIGS, type ThemeVariant } from './config';

export const applyThemeVariables = (variant: ThemeVariant): void => {
  const theme = THEME_CONFIGS[variant];
  const root = document.documentElement;

  Object.entries(theme.cssVars).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });

  // Apply loader-specific CSS variables so components can rely on globals
  root.style.setProperty('--pm-bg', theme.loadingColors.background);
  root.style.setProperty('--pm-filled', theme.loadingColors.primary);
  root.style.setProperty('--pm-empty', theme.cssVars.card);
  root.style.setProperty('--pm-border', theme.cssVars.border);
  root.style.setProperty('--pm-scan', `${theme.loadingColors.secondary}80`);
};
