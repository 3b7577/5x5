import { type FC } from 'react';

import { cn } from '@/lib/utils';

interface FilterToggleButtonProps {
  count: number;
  onClick: () => void;
}

const FilterToggleButton: FC<FilterToggleButtonProps> = ({
  count,
  onClick,
}) => {
  return (
    <div className='relative'>
      <button
        type='button'
        className={cn(
          'border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground h-9 rounded-md border-2 px-3 font-mono text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)]',
        )}
        onClick={onClick}
      >
        Filters
      </button>

      {count > 0 && (
        <span className='border-border bg-accent text-accent-foreground absolute -top-1 -right-1 rounded-full border-2 px-1.5 py-0.5 text-[10px] leading-none font-bold shadow-[2px_2px_0px_0px_var(--border)]'>
          {count}
        </span>
      )}
    </div>
  );
};

export default FilterToggleButton;
