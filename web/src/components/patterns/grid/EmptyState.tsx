import type { FC } from 'react';

const EmptyState: FC = () => {
  return (
    <div className='flex h-96 flex-col items-center justify-center text-center'>
      <h3 className='text-foreground mb-2 text-lg font-medium'>
        No patterns found
      </h3>

      <p className='text-muted-foreground'>
        Try adjusting your filters to see more results
      </p>
    </div>
  );
};

export default EmptyState;
