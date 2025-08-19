import type { CSSProperties, PointerEvent } from 'react';
import { useEffect, useMemo, useRef, useState } from 'react';

import { cn, sortRange } from '@/lib/utils';
import type { Range } from '@/types';

export interface CRTRangeSliderProps {
  className?: string;
  value: Range;
  onChange?: (v: Range) => void;
  onCommit?: (v: Range) => void;
  min?: number;
  max?: number;
  step?: number;
}

const clamp = (v: number, min: number, max: number) =>
  Math.min(max, Math.max(min, v));

const pxToValue = (
  clientX: number,
  trackRect: DOMRect,
  min: number,
  max: number,
  step: number,
): number => {
  const ratio = (clientX - trackRect.left) / trackRect.width;
  const raw = min + ratio * (max - min);
  const stepped = Math.round(raw / step) * step;
  return clamp(stepped, min, max);
};

const valueToPercent = (value: number, min: number, max: number) =>
  ((value - min) / (max - min)) * 100;

export default function CRTRangeSlider({
  className,
  value,
  onChange,
  onCommit,
  min = 0,
  max = 100,
  step = 1,
}: CRTRangeSliderProps) {
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  const isFixed = useMemo(() => min === max, [min, max]);
  useEffect(() => {
    if (isFixed && onCommit) onCommit([min, min]);
  }, [isFixed, min, onCommit]);

  const startPointer = (thumbIndex: 0 | 1) => (e: PointerEvent) => {
    if (isFixed) return;
    (e.target as Element).setPointerCapture(e.pointerId);
    setActiveThumb(thumbIndex);
  };

  const movePointer = (e: PointerEvent) => {
    if (isFixed) return;
    if (activeThumb === null) return;
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const nextVal = pxToValue(e.clientX, rect, min, max, step);
    const nextRange: Range =
      activeThumb === 0 ? [nextVal, value[1]] : [value[0], nextVal];
    onChange?.(nextRange);
  };

  const endPointer = () => {
    if (isFixed) return;
    if (activeThumb === null) return;
    setActiveThumb(null);
    const sorted = sortRange(value);
    onCommit?.(sorted);
  };

  const [low, high] = useMemo(() => sortRange(value), [value]);
  const lowPct = valueToPercent(low, min, max);
  const highPct = valueToPercent(high, min, max);

  const thumbStyle = (val: number): CSSProperties => ({
    left: `calc(${valueToPercent(val, min, max)}% - 8px)`,
    top: -6,
    position: 'absolute',
    cursor: 'pointer',
  });

  const Thumb = ({ index, val }: { index: 0 | 1; val: number }) => (
    <div
      onPointerDown={startPointer(index)}
      tabIndex={0}
      style={thumbStyle(val)}
    >
      <div
        className={cn(
          'border-primary bg-background block size-4 shrink-0 rounded-full border shadow-sm',
          'transition-[color,box-shadow,transform] duration-75',
          'ring-ring/50 hover:ring-4 focus-visible:ring-4 focus-visible:outline-hidden',
          activeThumb === index && 'scale-110',
        )}
      />
    </div>
  );

  return (
    <div
      className={cn('relative w-full select-none', className)}
      onPointerMove={movePointer}
      onPointerUp={endPointer}
      onPointerCancel={endPointer}
    >
      <div className='relative'>
        <div
          ref={trackRef}
          className={cn(
            'bg-muted relative h-1.5 w-full overflow-hidden rounded-full',
          )}
        />

        {isFixed ? (
          <div className='border-primary bg-primary/25 crt-glow-primary absolute top-[-6px] left-1/2 z-10 size-4 -translate-x-1/2 rounded-full border' />
        ) : (
          <>
            <div
              className={cn('bg-primary absolute top-0 h-1.5 rounded-full')}
              style={{ left: `${lowPct}%`, right: `${100 - highPct}%` }}
            />

            <div className='absolute inset-0'>
              <Thumb index={0} val={value[0]} />

              <Thumb index={1} val={value[1]} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
