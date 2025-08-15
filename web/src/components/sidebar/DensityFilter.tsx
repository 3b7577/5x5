import { useEffect, useState, type FC } from 'react';

import { densityValues } from '@/lib/utils';
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

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h3 className='text-sidebar-foreground crt-heading-sm tracking-wide uppercase'>
          Pixel Density
        </h3>

        <div className='crt-caption-muted flex justify-between'>
          <span>{densityValues(displayValue[0], displayValue[1]).min}</span>

          <span>{densityValues(displayValue[0], displayValue[1]).max}</span>
        </div>
      </div>

      <div className='px-2'>
        <Slider
          value={displayValue}
          onValueChange={(value) => setDragValue(value as Range)}
          onValueCommit={(value) => {
            setDensity(value as Range);
            setDragValue(null);
          }}
          max={25}
          min={0}
          step={1}
          className={'retro-slider'}
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
