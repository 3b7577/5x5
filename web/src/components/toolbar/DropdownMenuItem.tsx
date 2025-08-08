import { type FC } from 'react';
import { Monitor } from 'lucide-react';

import { cn } from '@/lib/utils';
import { DropdownMenuItem } from '@/components/ui/DropdownMenu';
import PatternPreview from '@/components/toolbar/PatternPreview';
import { type ThemeVariant } from '@/stores/useThemeStore';
import { themeConfig, useThemeContext } from '@/theme';

interface ThemeDropdownItemProps {
  themeKey: ThemeVariant;
  isActive: boolean;
  onSelect: (theme: ThemeVariant) => void;
  config: ReturnType<typeof useThemeContext>['config'];
}

const ThemeDropdownItem: FC<ThemeDropdownItemProps> = ({
  themeKey,
  isActive,
  onSelect,
  config,
}) => {
  const theme = themeConfig[themeKey];

  return (
    <DropdownMenuItem
      onClick={() => onSelect(themeKey)}
      className={cn(
        'relative m-1 cursor-pointer border-2 border-transparent px-3 py-2',
        'text-xs font-medium tracking-wide transition-all duration-150',
        'focus:bg-accent focus:text-accent-foreground',
        config.styles.dropdownItem,
        isActive && [
          'bg-accent text-accent-foreground border-current',
          config.styles.activeDropdownItem,
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
