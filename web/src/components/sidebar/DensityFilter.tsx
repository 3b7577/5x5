import { useEffect, useState, type FC } from 'react';

import { densityValues, sortRange } from '@/lib/utils';
import Slider from '@/components/ui/Slider';
import useFiltersStore from '@/stores/useFiltersStore';
import type { Range } from '@/types';

const DensityFilter: FC = () => {
  const { density, setDensity } = useFiltersStore();
  const [dragValue, setDragValue] = useState<Range | null>(null);

  // Clear drag state when store density changes (e.g., from reset)
  useEffect(() => {
    setDragValue(null);
  }, [density]);

  const displayValue = dragValue || density;
  const [sortedMin, sortedMax] = sortRange(displayValue);

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h3 className='text-sidebar-foreground crt-heading-sm tracking-wide uppercase'>
          Pixel Density
        </h3>

        <div className='crt-caption-muted flex justify-between'>
          <span>{densityValues(sortedMin, sortedMax).min}</span>

          <span>{densityValues(sortedMin, sortedMax).max}</span>
        </div>
      </div>

      <div className='px-2'>
        <Slider
          value={displayValue}
          onChange={(value) => setDragValue(value as Range)}
          onCommit={(value) => {
            setDensity(value as Range);
            setDragValue(null);
          }}
          max={25}
          min={0}
          step={1}
        />
      </div>

      <div className='crt-caption-muted flex justify-between uppercase'>
        <span>Empty</span>
        <span>Full</span>
      </div>
    </div>
  );
};

export default DensityFilter;
