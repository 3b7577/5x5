import { useMemo, useState, type FC } from 'react';

import PatternCard from '@/components/patterns/grid/PatternCard';
import PatternInfoModal from '@/components/patterns/pattern-info/PatternInfoModal';
import usePatternsStore from '@/stores/usePatternsStore';

const PatternsGrid: FC = () => {
  const { patterns } = usePatternsStore();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const selected = useMemo(
    () => patterns.find((p) => p.id === selectedId) || null,
    [patterns, selectedId],
  );

  const handlePatternClick = (id: number) => {
    setSelectedId(id);
  };

  return (
    <>
      <div className='xs:grid-cols-3 grid grid-cols-2 gap-2 sm:grid-cols-4 sm:gap-3 md:grid-cols-6 lg:grid-cols-8 xl:grid-cols-10 2xl:grid-cols-12'>
        {patterns.map((pattern) => (
          <PatternCard
            key={pattern.id}
            pattern={pattern}
            onClick={() => handlePatternClick(pattern.id)}
          />
        ))}
      </div>

      {!!selected && (
        <PatternInfoModal
          onClose={() => setSelectedId(null)}
          pattern={selected}
        />
      )}
    </>
  );
};

export default PatternsGrid;
