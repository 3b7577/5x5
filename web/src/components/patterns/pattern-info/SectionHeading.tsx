import { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionHeadingProps {
  className?: string;
  children: ReactNode;
}

const SectionHeading: FC<SectionHeadingProps> = ({ className, children }) => (
  <div
    className={cn(
      'text-muted-foreground mb-2 text-[11px] tracking-wide uppercase',
      className,
    )}
  >
    {children}
  </div>
);

export default SectionHeading;
