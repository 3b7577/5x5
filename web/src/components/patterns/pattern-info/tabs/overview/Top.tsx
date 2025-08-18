import { type FC } from 'react';

import { colSums, rowSums } from '@/lib/patternMath';
import { formatDensity } from '@/lib/utils';
import PatternOverlayCanvas from '@/components/patterns/pattern-info/PatternOverlayCanvas';
import usePatternInfoStore from '@/stores/usePatternInfoStore';

const Top: FC = () => {
  const {
    currentPattern: pattern,
    metrics,
    hoverOverlay,
  } = usePatternInfoStore();

  if (!pattern || !metrics) return null;

  const { matrix, density } = pattern;
  const size = matrix.length;
  const cellSize = 24;

  const rSums = rowSums(matrix);
  const cSums = colSums(matrix);
  const maxSum = Math.max(1, ...rSums, ...cSums);

  const bboxOverlay =
    metrics.bbox.width > 0 && hoverOverlay?.type === 'bbox'
      ? [
          {
            kind: 'rect' as const,
            rectRC: {
              r0: metrics.bbox.top,
              c0: metrics.bbox.left,
              r1: metrics.bbox.bottom,
              c1: metrics.bbox.right,
            },
            opacity: 0.9,
            dashed: true,
            strokeWidth: 2,
          },
        ]
      : [];

  const centroidOverlay =
    hoverOverlay?.type === 'bbox'
      ? [
          {
            kind: 'circle' as const,
            circle: {
              cx: metrics.centroid.col * cellSize + cellSize / 2,
              cy: metrics.centroid.row * cellSize + cellSize / 2,
              r: Math.max(3, Math.floor(cellSize * 0.28)),
            },
            opacity: 0.95,
            strokeWidth: 1,
            className: 'transition-opacity duration-150',
          },
        ]
      : [];

  const StatCard: FC<{ label: string; value: string | number }> = ({
    label,
    value,
  }) => (
    <div className='crt-card bg-background/60 flex h-20 flex-col items-center justify-center rounded text-center shadow-sm'>
      <div className='font-mono text-2xl tabular-nums'>{value}</div>
      <div className='text-muted-foreground text-[10px] uppercase'>{label}</div>
    </div>
  );

  return (
    <div className='lg:col-span-12'>
      <div className='grid grid-cols-1 items-center gap-6 lg:grid-cols-12'>
        <div className='flex justify-center lg:col-span-4'>
          <div
            className='relative'
            style={{ width: size * cellSize, height: size * cellSize }}
          >
            <PatternOverlayCanvas
              matrix={matrix}
              cellSize={cellSize}
              baseOpacity={1}
              overlays={[...bboxOverlay, ...centroidOverlay]}
              highlightQuadrant={
                hoverOverlay?.type === 'quadrant' ? hoverOverlay.key : null
              }
              showAxis={
                hoverOverlay?.type === 'axis' ? hoverOverlay.axis : null
              }
              className='absolute inset-0 [&_*]:transition-opacity [&_*]:duration-150'
            />

            <div className='pointer-events-none absolute top-[-6px] left-0 h-[3px] w-full'>
              {cSums.map((v, idx) => (
                <div
                  key={idx}
                  className='bg-primary/70 absolute top-0'
                  style={{
                    left: idx * cellSize,
                    width: cellSize,
                    height: 3,
                    opacity: Math.max(0.18, v / maxSum),
                  }}
                />
              ))}
            </div>

            <div className='pointer-events-none absolute top-0 left-[-6px] h-full w-[3px]'>
              {rSums.map((v, idx) => (
                <div
                  key={idx}
                  className='bg-primary/70 absolute left-0'
                  style={{
                    top: idx * cellSize,
                    width: 3,
                    height: cellSize,
                    opacity: Math.max(0.18, v / maxSum),
                  }}
                />
              ))}
            </div>
          </div>
        </div>

        <div className='lg:col-span-8'>
          <div className='grid grid-cols-3 gap-3'>
            <StatCard label='Density' value={`${metrics.fillPct}%`} />
            <StatCard label='Components' value={metrics.componentsCount} />
            <StatCard label='Perimeter' value={metrics.perimeter} />
          </div>

          <div className='mt-3 grid grid-cols-2 gap-3'>
            <StatCard label='Area' value={formatDensity(density)} />
            <StatCard label='Border hits' value={metrics.borderHitCellsCount} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Top;
