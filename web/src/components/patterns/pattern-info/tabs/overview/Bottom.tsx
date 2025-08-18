import { type FC } from 'react';

import SectionCard from '@/components/patterns/pattern-info/SectionCard';
import TagBadges from '@/components/patterns/pattern-info/TagBadges';
import usePatternInfoStore from '@/stores/usePatternInfoStore';

const Bottom: FC = () => {
  const { currentPattern, metrics } = usePatternInfoStore();

  if (!currentPattern || !metrics) return null;

  return (
    <div className='lg:col-span-12'>
      <SectionCard title='Tags' className='p-4'>
        <div className='flex flex-wrap gap-1'>
          <TagBadges tags={currentPattern.tags} compact />
        </div>
      </SectionCard>
    </div>
  );
};

export default Bottom;
