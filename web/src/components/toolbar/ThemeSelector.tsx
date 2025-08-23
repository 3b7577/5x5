import { type FC } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn } from '@/lib/utils';
import Button from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import PatternPreview from '@/components/toolbar/PatternPreview';
import ThemesMenuContent from '@/components/toolbar/ThemesMenuContent';
import type { ThemeConfig, ThemeVariant } from '@/theme';
import { THEME_GROUPS } from '@/theme/groups';

interface ThemeSelectorProps {
  variant: ThemeVariant;
  themeConfig: ThemeConfig;
  onSelect: (theme: ThemeVariant) => void;
  compact?: boolean;
  align?: 'start' | 'end';
}

const ThemeSelector: FC<ThemeSelectorProps> = ({
  variant,
  themeConfig,
  onSelect,
  compact = false,
  align = 'end',
}) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          size='sm'
          className={cn(
            'border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground h-9 border-2 px-3 font-medium tracking-wide transition-all duration-150',
            'font-mono uppercase shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_0px_var(--border)]',
          )}
        >
          <div className='flex items-center gap-2'>
            <PatternPreview
              pattern={themeConfig.pattern}
              color={themeConfig.color}
              bgColor={themeConfig.bgColor}
              size={14}
            />
            <span className='text-[10px] md:text-xs'>
              {compact ? 'Theme' : themeConfig.label}
            </span>
            <ChevronDown className='h-3 w-3' />
          </div>
        </Button>
      </DropdownMenuTrigger>

      <ThemesMenuContent
        align={align}
        groups={THEME_GROUPS}
        activeVariant={variant}
        onSelect={onSelect}
      />
    </DropdownMenu>
  );
};

export default ThemeSelector;
