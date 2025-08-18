import { type FC } from 'react';

import { formatDensity } from '@/lib/utils';
import CanvasPattern from '@/components/patterns/grid/CanvasPattern';
import type { Pattern } from '@/types';

interface PatternCardProps {
  pattern: Pattern;
  onClick?: () => void;
}

const PatternCard: FC<PatternCardProps> = ({ pattern, onClick }) => {
  return (
    <div
      className='crt-card-lg crt-shadow-base crt-shadow-hover flex cursor-pointer flex-col gap-2 py-3 hover:brightness-110'
      onClick={onClick}
    >
      <div className='flex flex-1 flex-col justify-center gap-2 px-3'>
        <p className='text-center text-xs font-bold'>{pattern.id}</p>

        <div className='flex justify-center'>
          <CanvasPattern pattern={pattern.matrix} />
        </div>

        <div className='crt-caption-center'>
          {formatDensity(pattern.density)}
        </div>
      </div>
    </div>
  );
};

export default PatternCard;
