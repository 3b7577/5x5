import { type FC } from 'react';

import { cn } from '@/lib/utils';
import { DropdownMenuContent } from '@/components/ui/DropdownMenu';
import ThemeDropdownItem from '@/components/toolbar/DropdownMenuItem';
import type { ThemeVariant } from '@/theme';
import type { ThemeGroup } from '@/theme/groups';

interface ThemesMenuContentProps {
  groups: ThemeGroup[];
  activeVariant: ThemeVariant;
  onSelect: (theme: ThemeVariant) => void;
  align?: 'start' | 'end';
}

const ThemesMenuContent: FC<ThemesMenuContentProps> = ({
  groups,
  activeVariant,
  onSelect,
  align = 'end',
}) => {
  return (
    <DropdownMenuContent
      align={align}
      className={cn(
        'border-border bg-card max-h-[400px] min-w-[260px] overflow-y-auto border-2 p-1',
        'shadow-[4px_4px_0px_0px_var(--border)]',
      )}
    >
      {groups.map((group, groupIndex) => (
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
              isActive={activeVariant === themeKey}
              onSelect={onSelect}
            />
          ))}
        </div>
      ))}
    </DropdownMenuContent>
  );
};

export default ThemesMenuContent;
