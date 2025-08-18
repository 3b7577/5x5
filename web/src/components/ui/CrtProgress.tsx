import type { FC } from 'react';

import { cn } from '@/lib/utils';

interface CrtProgressProps {
  percent: number;
  caption?: string;
  className?: string;
}

const CrtProgress: FC<CrtProgressProps> = ({ percent, caption, className }) => (
  <div className={cn('w-full', className)}>
    <div className='bg-muted/30 h-1.5 w-full overflow-hidden rounded-full'>
      <div
        className='bg-primary/80 h-1.5'
        style={{ width: `${Math.max(0, Math.min(100, Math.round(percent)))}%` }}
      />
    </div>
    {caption ? <div className='crt-caption-muted mt-1'>{caption}</div> : null}
  </div>
);

export default CrtProgress;
