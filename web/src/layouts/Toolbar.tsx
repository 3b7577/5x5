import { cn, pluralize } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import FilterToggleButton from '@/components/sidebar/FilterToggleButton';
import ThemeSelector from '@/components/toolbar/ThemeSelector';
import useDeviceStore from '@/stores/useDeviceStore';
import useFiltersStore from '@/stores/useFiltersStore';
import usePatternsStore from '@/stores/usePatternsStore';
import useThemeStore from '@/stores/useThemeStore';
import useUiStore from '@/stores/useUiStore';

export default function Toolbar() {
  const { variant, setTheme, themeConfig } = useThemeStore();
  const { totalCount } = usePatternsStore();
  const { selectedTags } = useFiltersStore();
  const isMobile = useDeviceStore((s) => s.isMobile);
  const openSidebar = useUiStore((s) => s.openSidebar);

  const countText = pluralize('Pattern', totalCount, true);

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
              <h1 className='text-primary crt-heading-sm font-bold tracking-wide'>
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
                  {countText}
                </p>
              )}

              <ThemeSelector
                variant={variant}
                themeConfig={themeConfig}
                onSelect={setTheme}
                align='end'
              />
            </div>
          </div>
        )}

        {isMobile && (
          <div className='grid grid-cols-[auto_1fr_auto] items-center'>
            <FilterToggleButton
              count={selectedTags.length}
              onClick={openSidebar}
            />

            {totalCount > 0 && (
              <p
                className={cn(
                  'text-accent justify-self-center text-center text-xs md:text-sm',
                  'crt-label',
                )}
              >
                {countText}
              </p>
            )}

            <div className='justify-self-end'>
              <ThemeSelector
                variant={variant}
                themeConfig={themeConfig}
                onSelect={setTheme}
                compact
                align='end'
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
