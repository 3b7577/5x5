import { type FC, type ReactNode } from 'react';

import SectionCard from '@/components/patterns/pattern-info/SectionCard';
import SectionHeading from '@/components/patterns/pattern-info/SectionHeading';
import usePatternInfoStore from '@/stores/usePatternInfoStore';

const InfoRow: FC<{
  label: ReactNode;
  value: ReactNode;
  rightSlot?: ReactNode;
}> = ({ label, value, rightSlot }) => {
  return (
    <div className='bg-muted/10 flex items-center justify-between rounded px-3 py-2'>
      <div className='text-muted-foreground text-xs'>{label}</div>
      <div className='flex items-center gap-2'>
        <div className='font-mono text-sm tabular-nums'>{value}</div>
        {rightSlot}
      </div>
    </div>
  );
};

const MiniStat: FC<{
  title: string;
  value: ReactNode;
}> = ({ title, value }) => {
  return (
    <div className='bg-muted/10 rounded px-3 py-2'>
      <div className='text-muted-foreground text-[10px] uppercase'>{title}</div>
      <div className='font-mono text-sm tabular-nums'>{value}</div>
    </div>
  );
};

const ProgressBar: FC<{ percent: number }> = ({ percent }) => {
  const safePercent = Math.max(0, Math.min(100, percent));
  return (
    <div
      className='bg-primary/10 relative h-2 w-24 overflow-hidden rounded'
      role='progressbar'
    >
      <div
        className='bg-primary h-full transition-[width] duration-300'
        style={{ width: `${safePercent}%` }}
      />
    </div>
  );
};

const GeometryAndStructure: FC = () => {
  const metrics = usePatternInfoStore((s) => s.metrics);
  const setHoverOverlay = usePatternInfoStore((s) => s.setHoverOverlay);

  if (!metrics) return null;

  return (
    <SectionCard className='p-4'>
      <div className='space-y-5'>
        <div>
          <SectionHeading>Structure</SectionHeading>
          <div className='space-y-2'>
            <InfoRow
              label='Longest run H/V'
              value={`${metrics.runs.horizontal}/${metrics.runs.vertical}`}
            />

            <InfoRow label='Holes' value={<span>{metrics.holeCount}</span>} />

            <InfoRow
              label='Adjacency'
              value={`${metrics.adjacency.withNeighborPct}%`}
              rightSlot={
                <ProgressBar percent={metrics.adjacency.withNeighborPct} />
              }
            />
            <div className='text-muted-foreground/80 px-1 text-[10px] leading-tight'>
              Percentage of filled cells with at least one neighbor (H/V/D).
            </div>
          </div>
        </div>

        <div>
          <SectionHeading>Geometry</SectionHeading>
          <div
            className='grid grid-cols-2 gap-3'
            onMouseEnter={() => setHoverOverlay({ type: 'bbox' })}
            onMouseLeave={() => setHoverOverlay(null)}
          >
            <div>
              <MiniStat
                title='BBox'
                value={`${metrics.bbox.width}×${metrics.bbox.height}`}
              />
            </div>
            <div>
              <MiniStat
                title='Centroid'
                value={`(${metrics.centroid.col.toFixed(1)}, ${metrics.centroid.row.toFixed(1)})`}
              />
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
};

export default GeometryAndStructure;
