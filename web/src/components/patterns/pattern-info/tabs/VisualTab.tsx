import { useMemo, type FC } from 'react';

import {
  getBordersPreset,
  getEdgeVsCenterPreset,
  getIsolatedPreset,
  getSymmetryPreset,
} from '@/lib/overlayPresets';
import { cn } from '@/lib/utils';
import usePatternInfoStore from '@/stores/usePatternInfoStore';
import type { OverlayPreset } from '@/types';

import PatternOverlayCanvas from '../PatternOverlayCanvas';

const VisualTab: FC = () => {
  const { currentPattern: pattern } = usePatternInfoStore();
  if (!pattern) return null;

  const presets: OverlayPreset[] = useMemo(() => {
    const symmetry = getSymmetryPreset(pattern);
    const borders = getBordersPreset(pattern);
    const centerVsEdge = getEdgeVsCenterPreset(pattern);
    const isolated = getIsolatedPreset(pattern);

    const generalSummary = [symmetry, borders, centerVsEdge, isolated]
      .map((preset) => preset.generalSummary ?? preset.summary)
      .flat();
    const allOverlays = [symmetry, borders, centerVsEdge, isolated]
      .filter((preset) => preset.isActive)
      .map((preset) => preset.overlays)
      .flat();

    return [
      {
        label: 'Base',
        overlays: [],
        isActive: true,
        summary: [],
      },
      symmetry,
      borders,
      centerVsEdge,
      isolated,
      {
        label: 'All overlays',
        overlays: allOverlays,
        isActive: true,
        summary: generalSummary,
      },
    ];
  }, [pattern.id]);

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-3'>
      {presets.map(({ label, isActive, overlays, summary }) => {
        return (
          <div
            key={label}
            className={cn(
              'bg-card ring-ring flex flex-col items-center gap-2',
              'rounded-md border px-2 pt-4 pb-2',
              'shadow-[3px_3px_0px_0px_var(--border)] ring-1 ring-inset',
              'transition-transform hover:scale-[1.01] hover:shadow-lg',
              !isActive && 'opacity-40',
            )}
          >
            <PatternOverlayCanvas
              matrix={pattern.matrix}
              cellSize={22}
              baseOpacity={1}
              overlays={overlays}
            />

            <div className='text-xs'>{label}</div>

            {summary.length > 0 && (
              <div className='mt-1 flex flex-wrap items-center justify-center gap-1'>
                {summary.map((text) => (
                  <span
                    key={text}
                    className='rounded-sm border px-1 py-[2px] text-[10px] leading-none opacity-80'
                  >
                    {text}
                  </span>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default VisualTab;
