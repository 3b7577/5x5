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
import useThemeStore, { type ThemeVariant } from '@/stores/useThemeStore';
import { useThemeContext } from '@/theme';

const THEME_GROUPS: { label: string; themes: ThemeVariant[] }[] = [
  {
    label: 'CRT Themes',
    themes: ['green-crt', 'amber-crt', 'blue-crt', 'purple-crt', 'red-crt'],
  },
  {
    label: 'Light Themes',
    themes: ['green-light', 'amber-light', 'blue-light'],
  },
  {
    label: 'Modern',
    themes: ['modern-dark'],
  },
];

const Toolbar: FC = () => {
  const { variant, setTheme } = useThemeStore();
  const { totalCount } = usePatternsStore();
  const { selectedTags } = useFiltersStore();
  const { texts, config } = useThemeContext(variant);

  const filtersBadgeText = `${selectedTags.length} ${pluralize('filter', selectedTags.length)} active`;

  return (
    <div
      className={cn(
        'border-border bg-card border-2 border-b-2 px-4 py-3',
        config.styles.layoutShadow,
      )}
    >
      <div className='flex items-center justify-between'>
        <div className='flex items-center gap-4'>
          <h1
            className={cn(
              'text-primary font-bold tracking-wide uppercase',
              config.styles.appTitle,
            )}
          >
            {texts.appTitle}
          </h1>

          {selectedTags.length > 0 && (
            <Badge
              variant='secondary'
              className={cn(
                'bg-accent text-accent-foreground shrink-0 font-normal tracking-wide uppercase',
                config.styles.filterBadge,
              )}
            >
              {filtersBadgeText}
            </Badge>
          )}
        </div>

        <div className='flex items-center gap-3'>
          {totalCount > 0 && (
            <p
              className={cn(
                'text-accent flex gap-2 text-sm',
                config.styles.countText,
              )}
            >
              {`${totalCount.toLocaleString()} ${texts.patterns}`}
            </p>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant='outline'
                size='sm'
                className={cn(
                  'border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground h-9 border-2 px-3 font-medium tracking-wide transition-all duration-150',
                  config.styles.themeButton,
                )}
                aria-label='Select theme'
              >
                <div className='flex items-center gap-2'>
                  <PatternPreview
                    pattern={config.pattern}
                    color={config.color}
                    bgColor={config.bgColor}
                    size={16}
                  />
                  <span className='text-xs'>{config.label}</span>
                  <ChevronDown className='h-3 w-3' />
                </div>
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              align='end'
              className={cn(
                'border-border bg-card max-h-[400px] min-w-[280px] overflow-y-auto border-2 p-1',
                config.styles.dropdownShadow,
              )}
            >
              {THEME_GROUPS.map((group, groupIndex) => (
                <div key={group.label}>
                  <div
                    className={cn(
                      groupIndex > 0 ? 'mt-2' : '',
                      'px-2 py-1 text-xs font-bold tracking-wider',
                      config.styles.sectionHeader,
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
                      config={config}
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
