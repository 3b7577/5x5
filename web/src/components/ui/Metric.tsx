import type { FC, ReactNode } from 'react';

interface MetricProps extends React.HTMLAttributes<HTMLDivElement> {
  label: ReactNode;
  children: ReactNode;
}

const Metric: FC<MetricProps> = ({ label, children, ...props }) => (
  <div {...props} className='flex gap-2 text-sm leading-6'>
    <span className='text-muted-foreground'>{label}</span>
    <span>{children}</span>
  </div>
);

export default Metric;
