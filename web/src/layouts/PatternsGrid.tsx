import { useEffect, useState, type FC } from 'react';

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
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetchPatterns();
  }, [density, selectedTags, fetchPatterns]);

  useEffect(() => {
    const container = document.getElementById('patterns-scroll-container');
    if (!container) return;
    const onScroll = () => setShowScrollTop(container.scrollTop > 400);
    container.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => container.removeEventListener('scroll', onScroll);
  }, [patterns.length]);

  return (
    <div
      id='patterns-scroll-container'
      className='bg-background flex-1 overflow-y-auto'
    >
      <div className='p-3 pb-6 sm:p-4 md:p-6 md:pb-40'>
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

      {showScrollTop && (
        <button
          type='button'
          className='border-border bg-card text-foreground fixed right-4 bottom-24 z-40 h-10 rounded-md border-2 px-3 font-mono text-xs uppercase shadow-[3px_3px_0px_0px_var(--border)] md:bottom-6'
          onClick={() => {
            const container = document.getElementById(
              'patterns-scroll-container',
            );
            if (container) container.scrollTo({ top: 0, behavior: 'smooth' });
          }}
        >
          Top
        </button>
      )}
    </div>
  );
};

export default PatternsGridLayout;
