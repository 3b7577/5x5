import type { FC } from 'react';

const ResultsHeader: FC = () => {
  return (
    <div className='mb-6'>
      <h3 className='text-foreground text-lg font-medium'>Pattern Gallery</h3>
      <p className='text-muted-foreground text-sm'>
        Explore beautiful 5x5 patterns
      </p>
    </div>
  );
};

export default ResultsHeader;
