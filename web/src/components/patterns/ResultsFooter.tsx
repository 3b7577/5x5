import type { FC } from 'react';

import Button from '@/components/ui/Button';
import usePatternsStore from '@/stores/usePatternsStore';

const ResultsFooter: FC = () => {
  const { patterns, totalCount, hasMore, isLoading, loadMore } =
    usePatternsStore();

  return (
    <div className='border-border bg-background/95 fixed right-0 bottom-0 left-80 z-10 flex flex-col items-center justify-center border-t px-6 py-4 backdrop-blur-sm'>
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
          className='mt-3'
        >
          {isLoading ? 'Loading...' : 'Load More'}
        </Button>
      )}
    </div>
  );
};

export default ResultsFooter;
