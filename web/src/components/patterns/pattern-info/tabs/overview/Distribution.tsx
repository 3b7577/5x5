import { type FC } from 'react';
import type { TagKey } from '@shared/tags';
import { TAG } from '@shared/tags';

import { cn } from '@/lib/utils';
import CrtProgress from '@/components/ui/CrtProgress';
import SectionCard from '@/components/patterns/pattern-info/SectionCard';
import SectionHeading from '@/components/patterns/pattern-info/SectionHeading';
import usePatternInfoStore from '@/stores/usePatternInfoStore';
import type { Axis, QuadrantKey } from '@/types';

type QuadrantBlockItem = { qKey: QuadrantKey; pct: number };
const QuadrantBlock: FC<{ quadrant: QuadrantBlockItem }> = ({
  quadrant: { qKey, pct },
}) => {
  const setHoverOverlay = usePatternInfoStore((s) => s.setHoverOverlay);

  return (
    <div
      className={cn(
        'relative h-16 w-full rounded border',
        pct > 0 ? 'bg-muted/85' : 'bg-muted/10',
      )}
      onMouseEnter={() => setHoverOverlay({ type: 'quadrant', key: qKey })}
      onMouseLeave={() => setHoverOverlay(null)}
    >
      <div className='absolute inset-0 flex items-center justify-center'>
        <span className='font-mono text-sm tabular-nums'>{pct}%</span>
      </div>
    </div>
  );
};

const Distribution: FC = () => {
  const { currentPattern, metrics, setHoverOverlay } = usePatternInfoStore();

  if (!currentPattern || !metrics) return null;

  const { tags } = currentPattern;

  const { center, edge, label } = metrics.centerVsEdge;

  const symmetryBadges: [string, TagKey, Axis][] = [
    ['H', TAG.SYM_H.key, 'H'],
    ['V', TAG.SYM_V.key, 'V'],
    ['Diag', TAG.SYM_DIAG.key, 'D'],
    ['Anti', TAG.SYM_ANTI_DIAG.key, 'AD'],
  ] as const;

  const quadrants: QuadrantBlockItem[] = [
    { qKey: 'tl', pct: Math.round(metrics.quadrants.tl) },
    { qKey: 'tr', pct: Math.round(metrics.quadrants.tr) },
    { qKey: 'bl', pct: Math.round(metrics.quadrants.bl) },
    { qKey: 'br', pct: Math.round(metrics.quadrants.br) },
  ];

  return (
    <SectionCard className='flex flex-col justify-between p-4'>
      <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
        <div className='space-y-3'>
          <SectionHeading>Distribution</SectionHeading>

          <div className='space-y-2'>
            <div className='flex items-center justify-between font-mono text-sm tabular-nums'>
              <span>
                Center {center} ({metrics.centerPct}%)
              </span>
              <span className='text-right'>
                Edge {edge} ({100 - metrics.centerPct}%)
              </span>
            </div>

            <div className='flex items-center justify-center'>
              <CrtProgress
                className='w-full max-w-[260px]'
                percent={metrics.centerPct}
              />
            </div>
            <div className='text-muted-foreground mt-1 text-center text-[10px]'>
              {label}
            </div>
          </div>
        </div>

        <div className='flex flex-col items-end space-y-3'>
          <SectionHeading>Symmetry</SectionHeading>

          <div className='flex items-center gap-2'>
            <span className='font-mono text-sm tabular-nums'>
              {metrics.symmetryCount}/4
            </span>

            <div className='text-muted-foreground text-[10px] uppercase'>
              Symmetry score
            </div>
          </div>

          <div className='flex items-center gap-1'>
            {symmetryBadges.map(([label, key, axis]) => (
              <span
                key={label}
                className={cn(
                  'rounded px-2 py-1 text-[10px]',
                  tags.includes(key)
                    ? 'bg-primary/15 text-primary border-primary/30 border'
                    : 'bg-muted/20 text-muted-foreground',
                )}
                onMouseEnter={() => setHoverOverlay({ type: 'axis', axis })}
                onMouseLeave={() => setHoverOverlay(null)}
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div>
        <SectionHeading className='mb-1'>Quadrants</SectionHeading>

        <div className='flex flex-col items-center'>
          <div className='flex w-full flex-col gap-2'>
            <div className='flex justify-between gap-2'>
              {quadrants.slice(0, 2).map((quadrant) => (
                <QuadrantBlock key={quadrant.qKey} quadrant={quadrant} />
              ))}
            </div>

            <div className='flex justify-between gap-2'>
              {quadrants.slice(2, quadrants.length).map((quadrant) => (
                <QuadrantBlock key={quadrant.qKey} quadrant={quadrant} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default Distribution;
