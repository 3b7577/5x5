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
import useDeviceStore from '@/stores/useDeviceStore';
import useFiltersStore from '@/stores/useFiltersStore';
import usePatternsStore from '@/stores/usePatternsStore';
import useThemeStore from '@/stores/useThemeStore';
import useUiStore from '@/stores/useUiStore';
import type { ThemeVariant } from '@/theme';

const THEME_GROUPS: { label: string; themes: ThemeVariant[] }[] = [
  {
    label: 'CRT Themes',
    themes: ['green-crt', 'amber-crt', 'blue-crt', 'purple-crt', 'red-crt'],
  },
];

export default function Toolbar() {
  const { variant, setTheme, themeConfig } = useThemeStore();
  const { totalCount } = usePatternsStore();
  const { selectedTags } = useFiltersStore();
  const isMobile = useDeviceStore((s) => s.isMobile);
  const openSidebar = useUiStore((s) => s.openSidebar);

  return (
    <div
      className={cn(
        'crt-card-lg border-2 border-b-2 px-3 py-2 md:px-4 md:py-3',
        'crt-shadow-base',
      )}
    >
      <div className='flex flex-col gap-3 md:gap-2'>
        {!isMobile && (
          <div className='grid grid-cols-[1fr_auto] items-center'>
            <div className='flex items-baseline gap-4'>
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
                  {`${selectedTags.length} ${pluralize('filter', selectedTags.length)} active`}
                </Badge>
              )}
            </div>
            <div className='flex items-center gap-4 justify-self-end'>
              {totalCount > 0 && (
                <p className={cn('text-accent text-sm', 'crt-label')}>
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
                        size={14}
                      />
                      <span className='text-[10px] md:text-xs'>
                        {themeConfig.label}
                      </span>
                      <ChevronDown className='h-3 w-3' />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className={cn(
                    'border-border bg-card max-h-[400px] min-w-[260px] overflow-y-auto border-2 p-1',
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
        )}

        {isMobile && (
          <div className='grid grid-cols-[auto_1fr_auto] items-center'>
            <div className='relative'>
              <button
                type='button'
                className={cn(
                  'border-border bg-card text-foreground hover:bg-accent hover:text-accent-foreground h-9 rounded-md border-2 px-3 font-mono text-xs uppercase shadow-[2px_2px_0px_0px_var(--border)]',
                )}
                aria-label='Open filters'
                onClick={openSidebar}
              >
                Filters
              </button>
              {selectedTags.length > 0 && (
                <span className='border-border bg-accent text-accent-foreground absolute -top-1 -right-1 rounded-full border-2 px-1.5 py-0.5 text-[10px] leading-none font-bold shadow-[2px_2px_0px_0px_var(--border)]'>
                  {selectedTags.length}
                </span>
              )}
            </div>
            {totalCount > 0 && (
              <p
                className={cn(
                  'text-accent justify-self-center text-center text-xs md:text-sm',
                  'crt-label',
                )}
              >
                {pluralize('Pattern', totalCount, true)}
              </p>
            )}
            <div className='justify-self-end'>
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
                        size={14}
                      />
                      <span className='text-[10px] md:text-xs'>Theme</span>
                      <ChevronDown className='h-3 w-3' />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align='end'
                  className={cn(
                    'border-border bg-card max-h-[400px] min-w-[260px] overflow-y-auto border-2 p-1',
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
        )}
      </div>
    </div>
  );
}
