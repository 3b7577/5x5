import { useEffect, type FC } from 'react';

import PixelMatrixLoader from '@/components/ui/PixelMatrixLoader';
import {
  EmptyState,
  PatternsGrid,
  ResultsFooter,
  ResultsHeader,
} from '@/components/patterns/grid';
import useFiltersStore from '@/stores/useFiltersStore';
import usePatternsStore from '@/stores/usePatternsStore';

const PatternsGridLayout: FC = () => {
  const { patterns, isLoading, isResetting, error, fetchPatterns } =
    usePatternsStore();
  const { density, selectedTags } = useFiltersStore();
  const hasPatterns = patterns.length !== 0;

  useEffect(() => {
    fetchPatterns();
  }, [density, selectedTags, fetchPatterns]);

  return (
    <div className='bg-background flex-1 overflow-y-auto'>
      <div className='p-6 pb-40'>
        {isLoading && (
          <div className='bg-background/90 fixed inset-0 z-[60] flex items-center justify-center backdrop-blur-sm'>
            <PixelMatrixLoader size={150} isResetting={isResetting} />
          </div>
        )}

        {error && !isLoading && !isResetting && (
          <div className='flex h-96 flex-col items-center justify-center text-center'>
            <div className='mb-4 text-6xl'>⚠️</div>
            <h3 className='text-foreground mb-2 text-lg font-medium'>
              Error loading patterns
            </h3>
            <p className='text-muted-foreground'>{error}</p>
          </div>
        )}

        {!hasPatterns && !isLoading && !isResetting && !error && <EmptyState />}

        {hasPatterns && !error && (
          <>
            <ResultsHeader />
            <PatternsGrid />
            <ResultsFooter />
          </>
        )}
      </div>
    </div>
  );
};

export default PatternsGridLayout;
