import { type FC } from 'react';

import usePatternsStore from '@/stores/usePatternsStore';

import PatternCard from './PatternCard';

const PatternsGrid: FC = () => {
  const { patterns } = usePatternsStore();

  const handlePatternClick = (id: number) => {
    console.log('Pattern clicked:', id);
    // TODO: Implement pattern detail view
  };

  return (
    <div className='grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12'>
      {patterns.map((pattern) => (
        <PatternCard
          key={pattern.id}
          id={pattern.id}
          pattern={pattern.pattern}
          density={pattern.density}
          onClick={() => handlePatternClick(pattern.id)}
        />
      ))}
    </div>
  );
};

export default PatternsGrid;
