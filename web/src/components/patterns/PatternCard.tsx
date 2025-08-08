import { type FC } from 'react';

import { cn } from '@/lib/utils';
import useThemeStore from '@/stores/useThemeStore';
import { useThemeContext } from '@/theme';
import type { Pattern } from '@/types';

import CanvasPattern from './CanvasPattern';

interface PatternCardProps extends Omit<Pattern, 'tags'> {
  onClick?: () => void;
}

const PatternCard: FC<PatternCardProps> = ({
  id,
  pattern,
  density,
  onClick,
}) => {
  const { variant } = useThemeStore();
  const {
    texts,
    config: { styles },
  } = useThemeContext(variant);

  return (
    <div
      className={cn(
        'bg-card text-card-foreground border-border flex cursor-pointer flex-col gap-2 rounded-lg border py-3 shadow-sm transition-all',
        styles.patternCard,
      )}
      onClick={onClick}
    >
      <div className='flex flex-1 flex-col justify-center gap-2 px-3'>
        <p className='text-center text-xs font-bold'>{id}</p>

        <div className='flex justify-center'>
          <CanvasPattern pattern={pattern} />
        </div>

        <div
          className={cn(
            'text-muted-foreground text-center text-xs font-normal',
            styles.body,
          )}
        >
          {texts.patternDensity(density)}
        </div>
      </div>
    </div>
  );
};

export default PatternCard;
