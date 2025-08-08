import { useEffect, type FC } from 'react';

import Button from '@/components/ui/Button';
import useFiltersStore from '@/stores/useFiltersStore';
import usePatternsStore from '@/stores/usePatternsStore';
import useThemeStore from '@/stores/useThemeStore';
import { useThemeContext } from '@/theme';

const ResetControls: FC = () => {
  const { selectedTags, density, resetFilters } = useFiltersStore();
  const { resetPatterns, isLoading, patterns, isResetting, setIsResetting } =
    usePatternsStore();
  const { variant } = useThemeStore();
  const {
    texts,
    config: { styles },
  } = useThemeContext(variant);

  const hasActiveFilters =
    selectedTags.length > 0 || density[0] !== 0 || density[1] !== 25;

  useEffect(() => {
    if (isResetting && !isLoading && patterns.length > 0) {
      setIsResetting(false);
    }
  }, [isResetting, isLoading, patterns.length, setIsResetting]);

  const handleReset = () => {
    if (!hasActiveFilters) return;

    setIsResetting(true);

    resetPatterns();
    resetFilters();
  };

  return (
    <div className='space-y-3'>
      <Button
        onClick={handleReset}
        disabled={!hasActiveFilters}
        className={`w-full font-medium tracking-wide ${styles.button}`}
        variant={hasActiveFilters ? 'destructive' : 'secondary'}
      >
        {texts.resetAll}
      </Button>

      {hasActiveFilters && (
        <div
          className={`text-muted-foreground text-center text-xs ${styles.body}`}
        >
          {texts.clearFilters}
        </div>
      )}
    </div>
  );
};

export default ResetControls;
