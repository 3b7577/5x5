import { type FC } from 'react';
import { TAGS } from '@shared/tags';

import { cn, groupBy } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import useFiltersStore from '@/stores/useFiltersStore';
import useThemeStore from '@/stores/useThemeStore';
import { useThemeContext } from '@/theme';

const tagsByCategory = groupBy(TAGS, 'category');

const TagCategories: FC = () => {
  const { selectedTags, toggleTag } = useFiltersStore();
  const { variant } = useThemeStore();
  const { texts, config } = useThemeContext(variant);
  const { styles } = config;

  return (
    <div className='space-y-4'>
      {Object.entries(tagsByCategory).map(([category, tags]) => (
        <div
          key={category}
          className={`border-border border-2 p-3 ${config.styles.card}`}
        >
          <div className='mb-3 flex items-center justify-between'>
            <h3
              className={`text-sidebar-foreground text-sm font-bold tracking-wide ${styles.title}`}
            >
              {category}
            </h3>

            <p
              className={`text-muted-foreground text-xs font-normal ${styles.body}`}
            >
              {texts.tagCount(tags.length)}
            </p>
          </div>

          <div className='flex flex-wrap gap-1'>
            {tags.map((tag) => {
              const isSelected = selectedTags.includes(tag.key);

              return (
                <Badge
                  key={tag.key}
                  variant={isSelected ? 'default' : 'outline'}
                  className={cn(
                    'cursor-pointer text-xs transition-all duration-100',
                    isSelected
                      ? 'bg-accent text-accent-foreground border-accent'
                      : 'border-border hover:bg-secondary hover:text-secondary-foreground',
                    config.styles.cardBorder,
                  )}
                  onClick={() => toggleTag(tag.key)}
                >
                  <span className={`font-medium break-words ${styles.body}`}>
                    {tag.label}
                  </span>
                </Badge>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default TagCategories;
