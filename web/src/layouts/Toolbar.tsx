import type { FC } from 'react';
import { ChevronDown } from 'lucide-react';

import { cn, pluralize } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import ThemeDropdownItem from '@/components/toolbar/DropdownMenuItem';
import PatternPreview from '@/components/toolbar/PatternPreview';
import useFiltersStore from '@/stores/useFiltersStore';
import usePatternsStore from '@/stores/usePatternsStore';
import useThemeStore from '@/stores/useThemeStore';
import type { ThemeVariant } from '@/theme';

const THEME_GROUPS: { label: string; themes: ThemeVariant[] }[] = [
  {
    label: 'CRT Themes',
    themes: ['green-crt', 'amber-crt', 'blue-crt', 'purple-crt', 'red-crt'],
  },
];

const Toolbar: FC = () => {
  const { variant, setTheme, themeConfig } = useThemeStore();
  const { totalCount } = usePatternsStore();
  const { selectedTags } = useFiltersStore();

  const filtersBadgeText = `${selectedTags.length} ${pluralize('filter', selectedTags.length)} active`;

  return (
    <div
      className={cn(
        'crt-card-lg border-2 border-b-2 px-4 py-3',
        'crt-shadow-base',
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1
            className={cn(
              'text-primary font-bold tracking-wide',
              'crt-heading-sm',
            )}
          >
            {`>> 5X5 PATTERNS <<`}
          </h1>

          {selectedTags.length > 0 && (
            <Badge
              variant='secondary'
              className={cn(
                'bg-accent text-accent-foreground shrink-0 tracking-wide uppercase',
                'crt-note',
              )}
            >
              {filtersBadgeText}
            </Badge>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {totalCount > 0 && (
            <p className={cn('text-accent flex gap-2 text-sm', 'crt-label')}>
              {pluralize('Pattern', totalCount, true)}
            </p>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className={cn(
                  'border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground h-9 border-2 px-3 font-medium tracking-wide transition-all duration-150',
                  'font-mono uppercase shadow-[2px_2px_0px_0px_var(--border)] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[3px_3px_0px_0px_var(--border)] active:translate-x-[0px] active:translate-y-[0px] active:shadow-[1px_1px_0px_0px_var(--border)]',
                )}
                aria-label='Select theme'
              >
                <div className='flex items-center gap-2'>
                  <PatternPreview
                    pattern={themeConfig.pattern}
                    color={themeConfig.color}
                    bgColor={themeConfig.bgColor}
                    size={16}
                  />
                  <span className='text-xs'>{themeConfig.label}</span>
                  <ChevronDown className='h-3 w-3' />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='end'
              className={cn(
                'border-border bg-card max-h-[400px] min-w-[280px] overflow-y-auto border-2 p-1',
                'shadow-[4px_4px_0px_0px_var(--border)]',
              )}
            >
              {THEME_GROUPS.map((group, groupIndex) => (
                <div key={group.label}>
                  <div
                    className={cn(
                      groupIndex > 0 ? 'mt-2' : '',
                      'px-2 py-1 text-xs font-bold tracking-wider',
                      'text-muted-foreground uppercase',
                    )}
                  >
                    {group.label}
                  </div>

                  {group.themes.map((themeKey) => (
                    <ThemeDropdownItem
                      key={themeKey}
                      themeKey={themeKey}
                      isActive={variant === themeKey}
                      onSelect={setTheme}
                    />
                  ))}
                </div>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
