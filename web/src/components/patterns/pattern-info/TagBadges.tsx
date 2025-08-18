import { useMemo, type FC } from 'react';
import { TAGS } from '@shared/tags';

import { groupBy } from '@/lib/utils';
import Badge from '@/components/ui/Badge';

interface Props {
  tags: string[];
  compact?: boolean;
}

const TagBadges: FC<Props> = ({ tags, compact }) => {
  const byKey = useMemo(
    () => Object.fromEntries(TAGS.map((t) => [t.key, t])),
    [],
  );
  const selected = useMemo(
    () => tags.map((k) => byKey[k]).filter(Boolean),
    [tags, byKey],
  );
  const grouped = groupBy(selected, 'category');

  return (
    <div className='flex flex-col gap-2'>
      {Object.entries(grouped).map(([category, items]) => (
        <div key={category} className='flex flex-wrap items-center gap-1'>
          <span className='text-muted-foreground text-[10px] whitespace-nowrap'>
            {category}
          </span>

          {items.map((t) => (
            <Badge
              key={t.key}
              variant='secondary'
              className={
                compact
                  ? 'bg-muted/60 text-muted-foreground px-1.5 py-0.5 text-[10px] shadow-none'
                  : undefined
              }
            >
              {t.label}
            </Badge>
          ))}
        </div>
      ))}
    </div>
  );
};

export default TagBadges;
