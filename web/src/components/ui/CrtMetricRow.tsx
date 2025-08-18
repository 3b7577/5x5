import type { FC, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface CrtMetricRowProps {
  label: ReactNode;
  className?: string;
  children: ReactNode;
}

const CrtMetricRow: FC<CrtMetricRowProps> = ({
  label,
  className,
  children,
}) => (
  <div className={cn('flex items-center gap-3 py-2', className)}>
    <div className='crt-caption-muted w-32 shrink-0 text-right whitespace-nowrap'>
      {label}
    </div>
    <div className='flex-1 truncate pl-2 font-mono tabular-nums'>
      {children}
    </div>
  </div>
);

export default CrtMetricRow;
