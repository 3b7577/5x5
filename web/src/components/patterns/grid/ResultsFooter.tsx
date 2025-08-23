import type { FC } from 'react';

import Button from '@/components/ui/Button';
import usePatternsStore from '@/stores/usePatternsStore';

const ResultsFooter: FC = () => {
  const { patterns, totalCount, hasMore, isLoading, loadMore } =
    usePatternsStore();

  return (
    <div className='border-border bg-background/95 right-0 bottom-0 left-0 z-10 flex flex-col items-center justify-center border-t px-4 py-3 md:fixed md:left-80 md:px-6 md:py-4 md:backdrop-blur-sm'>
      <div className='text-center'>
        <p className='text-muted-foreground mb-2 text-sm'>
          Showing {patterns.length} of {totalCount} patterns
        </p>
        <p className='text-muted-foreground text-xs'>
          Use filters to narrow down your search
        </p>
      </div>

      {hasMore && (
        <Button
          onClick={loadMore}
          disabled={isLoading}
          variant='outline'
          className='mt-2 md:mt-3'
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
};

export default ResultsFooter;
