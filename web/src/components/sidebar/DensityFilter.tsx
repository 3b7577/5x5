import { useEffect, useState, type FC } from 'react';

import Slider from '@/components/ui/Slider';
import useFiltersStore from '@/stores/useFiltersStore';
import useThemeStore from '@/stores/useThemeStore';
import { useThemeContext } from '@/theme';
import type { Range } from '@/types';

const DensityFilter: FC = () => {
  const { density, setDensity } = useFiltersStore();
  const { variant } = useThemeStore();
  const { texts, config } = useThemeContext(variant);
  const { styles } = config;
  const [dragValue, setDragValue] = useState<Range | null>(null);

  // Clear drag state when store density changes (e.g., from reset)
  useEffect(() => {
    setDragValue(null);
  }, [density]);

  const displayValue = dragValue || density;

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <h3
          className={`text-sidebar-foreground text-sm font-bold tracking-wide ${styles.title}`}
        >
          {texts.pixelDensity}
        </h3>
        <div
          className={`text-muted-foreground flex justify-between text-xs font-normal ${styles.body}`}
        >
          <span>
            {texts.densityValues(displayValue[0], displayValue[1]).min}
          </span>

          <span>
            {texts.densityValues(displayValue[0], displayValue[1]).max}
          </span>
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
          className={config.styles.sliderClass}
        />
      </div>

      <div
        className={`text-muted-foreground flex justify-between text-xs font-normal ${styles.body}`}
      >
        <span>{texts.empty}</span>
        <span>{texts.full}</span>
      </div>
    </div>
  );
};

export default DensityFilter;
