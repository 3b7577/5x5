import { useEffect, type FC } from 'react';

import Button from '@/components/ui/Button';
import useFiltersStore from '@/stores/useFiltersStore';
import usePatternsStore from '@/stores/usePatternsStore';

const ResetControls: FC = () => {
  const { selectedTags, density, resetFilters } = useFiltersStore();
  const { resetPatterns, isLoading, patterns, isResetting, setIsResetting } =
    usePatternsStore();

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
        className='w-full font-mono font-medium tracking-wide uppercase'
        variant={hasActiveFilters ? 'destructive' : 'secondary'}
      >
        [Reset All]
      </Button>

      {hasActiveFilters && (
        <div className='text-muted-foreground text-center font-mono text-xs uppercase [text-shadow:_0_0_1px_currentColor]'>
          Clear all active filters
        </div>
      )}
    </div>
  );
};

export default ResetControls;
