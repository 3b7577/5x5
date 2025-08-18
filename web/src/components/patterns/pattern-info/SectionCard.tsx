import { type FC, type ReactNode } from 'react';

import { cn } from '@/lib/utils';

interface SectionCardProps {
  title?: ReactNode;
  className?: string;
  children: ReactNode;
  titleClassName?: string;
}

const SectionCard: FC<SectionCardProps> = ({
  title,
  className,
  children,
  titleClassName,
}) => (
  <div className={cn('crt-card', className)}>
    {title && (
      <div
        className={cn(
          'text-muted-foreground mb-2 text-[11px] tracking-wide uppercase',
          titleClassName,
        )}
      >
        {title}
      </div>
    )}
    {children}
  </div>
);

export default SectionCard;
