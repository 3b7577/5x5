import { type FC } from 'react';

import { cn } from '@/lib/utils';
import usePatternInfoStore from '@/stores/usePatternInfoStore';

const DebugTab: FC = () => {
  const { currentPattern, bitId, bitsHex, bitsBinary } = usePatternInfoStore();
  if (!currentPattern || bitId === null || bitsHex === null) return null;
  const { matrix } = currentPattern;
  const size = matrix.length;

  return (
    <div className='grid grid-cols-1 gap-4'>
      <div className='font-mono text-xs'>
        imgBits: {bitId} ({bitsHex}) ({bitsBinary})
      </div>

      <div className='grid grid-cols-5 gap-1 font-mono text-[10px]'>
        {currentPattern.matrix.map((row, rowIndex) =>
          row.map((col, colIndex) => {
            const idx = size * size - 1 - (rowIndex * size + colIndex);

            return (
              <div
                key={idx}
                className={cn(
                  'flex h-8 items-center justify-center rounded border',
                  col ? 'bg-primary text-primary-foreground' : 'bg-muted',
                )}
                title={`bit ${idx}`}
              >
                {idx}
              </div>
            );
          }),
        )}
      </div>
    </div>
  );
};

export default DebugTab;
