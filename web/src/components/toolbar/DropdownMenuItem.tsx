import { type FC } from 'react';
import { Monitor } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DropdownMenuItem } from '@/components/ui/DropdownMenu';
import PatternPreview from '@/components/toolbar/PatternPreview';
import { THEME_CONFIGS, type ThemeVariant } from '@/theme';

interface ThemeDropdownItemProps {
  themeKey: ThemeVariant;
  isActive: boolean;
  onSelect: (theme: ThemeVariant) => void;
}

const ThemeDropdownItem: FC<ThemeDropdownItemProps> = ({
  themeKey,
  isActive,
  onSelect,
}) => {
  const theme = THEME_CONFIGS[themeKey];

  return (
    <DropdownMenuItem
      onClick={() => onSelect(themeKey)}
      className={cn(
        'relative m-1 cursor-pointer border-2 border-transparent px-3 py-2',
        'text-xs font-medium tracking-wide transition-all duration-150',
        'focus:bg-accent focus:text-accent-foreground',
        'rounded-none font-mono uppercase hover:translate-x-[-1px] hover:translate-y-[-1px] hover:border-current hover:shadow-[2px_2px_0px_0px_var(--border)]',
        isActive && [
          'bg-accent text-accent-foreground border-current',
          'shadow-[2px_2px_0px_0px_var(--border)]',
        ],
      )}
    >
      <div className='flex w-full items-center justify-between'>
        <div className='flex items-center gap-3'>
          <PatternPreview
            pattern={theme.pattern}
            color={theme.color}
            bgColor={theme.bgColor}
            size={24}
          />
          <span>{theme.label}</span>
        </div>

        {isActive && <Monitor className='text-accent-foreground h-3 w-3' />}
      </div>
    </DropdownMenuItem>
  );
};

export default ThemeDropdownItem;
