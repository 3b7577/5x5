import type { ThemeVariant } from '@/stores/useThemeStore';

import { themeConfig } from './config';

/**
 * Apply theme CSS variables to the document root
 */
export const applyThemeVariables = (variant: ThemeVariant): void => {
  const theme = themeConfig[variant];
  const root = document.documentElement;

  [...root.classList]
    .filter((cls) => /^theme-/.test(cls))
    .forEach((cls) => root.classList.remove(cls));

  root.classList.add(`theme-${theme.type}`);

  // Apply all CSS variables
  Object.entries(theme.cssVars).forEach(([key, value]) => {
    // Convert camelCase to kebab-case for CSS variables
    const cssVarName = `--${key.replace(/([A-Z])/g, '-$1').toLowerCase()}`;
    root.style.setProperty(cssVarName, value);
  });

  // Apply scanline effect with theme color
  applyScanlineEffect(variant);
};

/**
 * Get theme scanline color for CSS effects
 */
export const getThemeScanlineColor = (variant: ThemeVariant): string => {
  const theme = themeConfig[variant];
  // Extract RGB values from hex color
  const hex = theme.color.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  return `rgba(${r}, ${g}, ${b}, 0.02)`;
};

/**
 * Apply scanline effect with theme-specific color
 */
const applyScanlineEffect = (variant: ThemeVariant): void => {
  const styleElement =
    document.getElementById('dynamic-scanlines') ||
    document.createElement('style');
  styleElement.id = 'dynamic-scanlines';

  const theme = themeConfig[variant];

  // Only CRT themes have scanlines
  if (theme.type === 'crt') {
    const scanlineColor = getThemeScanlineColor(variant);
    const opacity = '0.02'; // Standard opacity for CRT scanlines

    const scanlineStyle = `repeating-linear-gradient(
      0deg,
      transparent,
      transparent 2px,
      ${scanlineColor.replace('0.02', opacity)} 2px,
      ${scanlineColor.replace('0.02', opacity)} 4px
    )`;

    styleElement.textContent = `
      body::before {
        display: block !important;
        background: ${scanlineStyle} !important;
      }
    `;
  } else {
    // Light and modern themes have no scanlines
    styleElement.textContent = `
      body::before {
        display: none !important;
      }
    `;
  }

  if (!document.head.contains(styleElement)) {
    document.head.appendChild(styleElement);
  }
};

/**
 * Get theme configuration for a specific variant
 */
export const getThemeConfig = (variant: ThemeVariant) => {
  return themeConfig[variant];
};

/**
 * Get theme type from variant
 */
export const getThemeType = (variant: ThemeVariant) => {
  return themeConfig[variant].type;
};
