import { useLayoutEffect } from 'react';

import useThemeStore from '@/stores/useThemeStore';
import { applyThemeVariables } from '@/theme';

export const useThemeEffect = () => {
  const variant = useThemeStore((state) => state.variant);

  useLayoutEffect(() => {
    // Apply theme CSS variables before browser paint (prevents flash)
    applyThemeVariables(variant);
  }, [variant]);
};
