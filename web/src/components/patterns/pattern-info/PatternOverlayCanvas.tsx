import { memo, useMemo, type FC, type JSX } from 'react';

import { cn } from '@/lib/utils';
import CanvasPattern from '@/components/patterns/grid/CanvasPattern'; // твій існуючий
import type {
  Axis,
  OverlayItem,
  OverlayPalette,
  PatternMatrix,
  QuadrantKey,
} from '@/types';

interface PatternOverlayCanvasProps {
  matrix: PatternMatrix;
  cellSize?: number;
  baseOpacity?: number;
  overlays?: OverlayItem[];
  className?: string;
  highlightQuadrant?: QuadrantKey | null;
  showAxis?: Axis | null;
}

const palette: Required<OverlayPalette> = {
  base: 'var(--primary)',
  accent: 'var(--accent, var(--primary))',
  muted: 'var(--muted)',
  grid: 'var(--muted)',
  destructive: 'var(--destructive, #ff5252)',
};

type Bounds = { r0: number; c0: number; r1: number; c1: number };

const computeQuadrantBounds = (n: number): Record<QuadrantKey, Bounds> => {
  const mid = Math.floor(n / 2);
  const even = n % 2 === 0;
  return {
    tl: { r0: 0, c0: 0, r1: mid - 1, c1: mid - 1 },
    tr: { r0: 0, c0: even ? mid : mid + 1, r1: mid - 1, c1: n - 1 },
    bl: { r0: even ? mid : mid + 1, c0: 0, r1: n - 1, c1: mid - 1 },
    br: {
      r0: even ? mid : mid + 1,
      c0: even ? mid : mid + 1,
      r1: n - 1,
      c1: n - 1,
    },
  } as const;
};

const isWithin = (r: number, c: number, b: Bounds) =>
  r >= b.r0 && r <= b.r1 && c >= b.c0 && c <= b.c1;

const rectForBounds = (b: Bounds, cellSize: number) => ({
  x: b.c0 * cellSize,
  y: b.r0 * cellSize,
  w: (b.c1 - b.c0 + 1) * cellSize,
  h: (b.r1 - b.r0 + 1) * cellSize,
});

const axisCoordinates = (
  axis: Axis,
  size: number,
): { x1: number; y1: number; x2: number; y2: number } => {
  switch (axis) {
    case 'H':
      return { x1: 0, y1: size / 2, x2: size, y2: size / 2 };
    case 'V':
      return { x1: size / 2, y1: 0, x2: size / 2, y2: size };
    case 'D':
      return { x1: 0, y1: 0, x2: size, y2: size };
    case 'AD':
      return { x1: size, y1: 0, x2: 0, y2: size };
  }
};

const PatternOverlayCanvas: FC<PatternOverlayCanvasProps> = memo(
  ({
    matrix,
    cellSize = 22,
    baseOpacity = 1,
    overlays = [],
    className = '',
    highlightQuadrant = null,
    showAxis = null,
  }) => {
    const n = matrix.length;
    const size = n * cellSize;

    const svgProps = {
      width: size,
      height: size,
      viewBox: `0 0 ${size} ${size}`,
      className: 'pointer-events-none absolute inset-0',
      shapeRendering: 'crispEdges',
    };

    const cellRect = (r: number, c: number) => ({
      x: c * cellSize,
      y: r * cellSize,
      w: cellSize,
      h: cellSize,
    });

    const renderOverlay = (o: OverlayItem, idx: number) => {
      const op =
        o.opacity ?? (o.kind === 'cellFill' || o.kind === 'dot' ? 0.6 : 1);
      const sw = o.strokeWidth ?? (o.kind === 'axis' ? 2 : 1.5);

      switch (o.kind) {
        case 'axis': {
          const dash = o.dashed ?? true;
          if (!o.axis) return null;
          const { x1, y1, x2, y2 } = axisCoordinates(o.axis, size);

          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={palette.accent}
              strokeWidth={sw}
              strokeDasharray={dash ? '4 3' : undefined}
              vectorEffect='non-scaling-stroke'
              opacity={op}
              className={o.className}
            />
          );
        }

        case 'cellFill': {
          return (
            <g key={idx}>
              {o.cells?.map(({ r, c }, i) => {
                const { x, y, w, h } = cellRect(r, c);
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={palette.accent}
                    opacity={op}
                    className={o.className}
                  />
                );
              })}
            </g>
          );
        }

        case 'cellOutline': {
          return (
            <g key={idx}>
              {o.cells?.map(({ r, c }, i) => {
                const { x, y, w, h } = cellRect(r, c);
                return (
                  <rect
                    key={i}
                    x={x + 0.5}
                    y={y + 0.5}
                    width={w - 1}
                    height={h - 1}
                    fill='none'
                    stroke={palette.accent}
                    strokeWidth={sw}
                    vectorEffect='non-scaling-stroke'
                    opacity={op}
                    className={o.className}
                  />
                );
              })}
            </g>
          );
        }

        case 'cellZone': {
          return (
            <g key={idx}>
              {o.cells?.map(({ r, c }, i) => {
                const { x, y, w, h } = cellRect(r, c);
                return (
                  <rect
                    key={i}
                    x={x}
                    y={y}
                    width={w}
                    height={h}
                    fill={palette.accent}
                    opacity={o.opacity ?? 0.1}
                    className={o.className}
                  />
                );
              })}
            </g>
          );
        }

        case 'dot': {
          const rads = Math.max(2, cellSize * 0.22);
          return (
            <g key={idx}>
              {o.cells?.map(({ r, c }, i) => (
                <circle
                  key={i}
                  cx={c * cellSize + cellSize / 2}
                  cy={r * cellSize + cellSize / 2}
                  r={rads}
                  fill={palette.destructive}
                  opacity={op}
                  className={o.className}
                />
              ))}
            </g>
          );
        }

        case 'ring': {
          return (
            <circle
              key={idx}
              cx={size / 2}
              cy={size / 2}
              r={cellSize * 1.25}
              fill='none'
              stroke={palette.accent}
              strokeWidth={sw}
              strokeDasharray={o.dashed ? '3 3' : undefined}
              vectorEffect='non-scaling-stroke'
              opacity={op}
              className={o.className}
            />
          );
        }

        case 'rect': {
          const r0 = o.rectRC?.r0 ?? 0;
          const c0 = o.rectRC?.c0 ?? 0;
          const r1 = o.rectRC?.r1 ?? n - 1;
          const c1 = o.rectRC?.c1 ?? n - 1;
          const x = c0 * cellSize;
          const y = r0 * cellSize;
          const w = (c1 - c0 + 1) * cellSize;
          const h = (r1 - r0 + 1) * cellSize;

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={w}
              height={h}
              fill='none'
              stroke={palette.accent}
              strokeWidth={sw}
              strokeDasharray={o.dashed ? '4 3' : undefined}
              vectorEffect='non-scaling-stroke'
              opacity={op}
              className={o.className}
            />
          );
        }

        case 'circle': {
          if (!o.circle) return null;
          const { cx, cy, r } = o.circle;
          return (
            <circle
              key={idx}
              cx={cx}
              cy={cy}
              r={r}
              fill='none'
              stroke={palette.accent}
              strokeWidth={o.strokeWidth ?? 1}
              vectorEffect='non-scaling-stroke'
              opacity={o.opacity ?? 0.9}
              className={o.className}
            />
          );
        }

        case 'line': {
          if (!o.line) return null;
          const { x1, y1, x2, y2 } = o.line;
          return (
            <line
              key={idx}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke={palette.accent}
              strokeWidth={sw}
              strokeDasharray={o.dashed ? '4 3' : undefined}
              vectorEffect='non-scaling-stroke'
              opacity={op}
              className={o.className}
            />
          );
        }

        default:
          return null;
      }
    };

    const quadrantMask = useMemo(() => {
      if (!highlightQuadrant) return null;
      const maskRects: JSX.Element[] = [];
      const dims = computeQuadrantBounds(n);
      const active = dims[highlightQuadrant];
      for (let r = 0; r < n; r++) {
        for (let c = 0; c < n; c++) {
          const inActive = isWithin(r, c, active);
          if (inActive) continue;
          const { x, y, w, h } = cellRect(r, c);
          maskRects.push(
            <rect
              key={`qm-${r}-${c}`}
              x={x}
              y={y}
              width={w}
              height={h}
              fill={palette.muted}
              opacity={0.14}
            />,
          );
        }
      }

      const {
        x: activeRectX,
        y: activeRectY,
        w: activeRectW,
        h: activeRectH,
      } = rectForBounds(active, cellSize);

      maskRects.push(
        <rect
          key={`qm-outline-${highlightQuadrant}`}
          x={activeRectX + 0.5}
          y={activeRectY + 0.5}
          width={activeRectW - 1}
          height={activeRectH - 1}
          fill='none'
          stroke={palette.accent}
          strokeWidth={1.5}
          vectorEffect='non-scaling-stroke'
          opacity={0.9}
        />,
      );
      return <g className='transition-opacity duration-150'>{maskRects}</g>;
    }, [highlightQuadrant, n, cellSize, palette.muted, palette.accent]);

    const axisOverlay = useMemo(() => {
      if (!showAxis) return null;
      const axisItem: OverlayItem = {
        kind: 'axis',
        axis: showAxis,
        opacity: 0.9,
        dashed: false,
        strokeWidth: 1,
      };

      return (
        <g className='transition-opacity duration-150'>
          {renderOverlay(axisItem, -1)}
        </g>
      );
    }, [showAxis, palette.accent]);

    return (
      <div
        className={cn('relative', className)}
        style={{ width: size, height: size }}
      >
        <div style={{ opacity: baseOpacity }}>
          <CanvasPattern pattern={matrix} cellSize={cellSize} />
        </div>

        <svg {...svgProps}>
          {overlays.map(renderOverlay)}
          {quadrantMask}
          {axisOverlay}
        </svg>
      </div>
    );
  },
);

export default PatternOverlayCanvas;
