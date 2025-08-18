import type { FC, HTMLAttributes, ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface CrtPillProps extends HTMLAttributes<HTMLSpanElement> {
  children: ReactNode;
  className?: string;
}

const CrtPill: FC<CrtPillProps> = ({ children, className, ...props }) => (
  <span
    className={cn(
      'bg-muted/30 rounded px-2 py-0.5 text-[10px] whitespace-nowrap',
      className,
    )}
    {...props}
  >
    {children}
  </span>
);

export default CrtPill;
