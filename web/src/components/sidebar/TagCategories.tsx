import { type FC } from 'react';
import { TAGS } from '@shared/tags';

import { cn, groupBy, pluralize } from '@/lib/utils';
import Badge from '@/components/ui/Badge';
import useFiltersStore from '@/stores/useFiltersStore';

const tagsByCategory = groupBy(TAGS, 'category');

const TagCategories: FC = () => {
  const { selectedTags, toggleTag } = useFiltersStore();

  return (
    <div className='space-y-4'>
      {Object.entries(tagsByCategory).map(([category, tags]) => (
        <div key={category} className='border-border border-2 p-3'>
          <div className='mb-3 flex items-center justify-between'>
            <h3 className='text-sidebar-foreground crt-heading-sm tracking-wide'>
              {category}
            </h3>

            <p className='crt-caption-muted'>
              {pluralize('TAG', tags.length, true)}
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
                  )}
                  onClick={() => toggleTag(tag.key)}
                >
                  <span className='crt-caption font-mono font-medium break-words'>
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
