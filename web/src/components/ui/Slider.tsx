import type { CSSProperties, PointerEvent as ReactPointerEvent } from 'react';
import { useEffect, useRef, useState } from 'react';

import { cn, sortRange } from '@/lib/utils';
import type { Range } from '@/types';

export interface RangeSliderProps {
  className?: string;
  value: Range;
  onChange?: (v: Range) => void;
  onCommit?: (v: Range) => void;
  min?: number;
  max?: number;
  step?: number;
}

const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));
const toStep = (raw: number, min: number, step: number) =>
  Math.round((raw - min) / step) * step + min;

const pxToValue = (
  clientX: number,
  rect: DOMRect,
  min: number,
  max: number,
  step: number,
): number => {
  const ratio = rect.width <= 0 ? 0 : (clientX - rect.left) / rect.width;
  const raw = min + ratio * (max - min);
  return clamp(toStep(raw, min, step), min, max);
};

const valueToPercent = (value: number, min: number, max: number) =>
  ((value - min) / (max - min)) * 100;

const THUMB_HIT_SIZE = 28;

export default function RangeSlider({
  className,
  value,
  onChange,
  onCommit,
  min = 0,
  max = 100,
  step = 1,
}: RangeSliderProps) {
  const [activeThumb, setActiveThumb] = useState<0 | 1 | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);
  const rectRef = useRef<DOMRect | null>(null);

  const span = max - min;
  const fixed = span <= 0 || min === max || step <= 0;

  const [low, high] = sortRange(value);

  const startPointer = (thumbIndex: 0 | 1) => () => {
    if (fixed) return;
    setActiveThumb(thumbIndex);
    rectRef.current = trackRef.current?.getBoundingClientRect() ?? null;
  };

  const startFromTrack = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (fixed) return;
    const track = trackRef.current;
    if (!track) return;
    e.preventDefault();
    const rect = (rectRef.current = track.getBoundingClientRect());
    const clickVal = pxToValue(e.clientX, rect, min, max, step);
    const [curLow, curHigh] = sortRange(value);
    const distToLow = Math.abs(clickVal - curLow);
    const distToHigh = Math.abs(clickVal - curHigh);
    const chosen: 0 | 1 = distToLow <= distToHigh ? 0 : 1;
    setActiveThumb(chosen);
    const next: Range =
      chosen === 0 ? [clickVal, value[1]] : [value[0], clickVal];
    onChange?.(next);
  };

  useEffect(() => {
    if (activeThumb === null || fixed) return;

    const handleMove = (e: PointerEvent) => {
      const rect = rectRef.current ?? trackRef.current?.getBoundingClientRect();
      if (!rect) return;
      const nextVal = pxToValue(e.clientX, rect, min, max, step);
      const next: Range =
        activeThumb === 0 ? [nextVal, value[1]] : [value[0], nextVal];
      onChange?.(next);
    };

    const finish = () => {
      setActiveThumb(null);
      rectRef.current = null;
      onCommit?.(sortRange(value));
    };

    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', finish, { once: true });
    window.addEventListener('pointercancel', finish, { once: true });

    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', finish);
      window.removeEventListener('pointercancel', finish);
    };
  }, [activeThumb, fixed, min, max, step, onChange, onCommit, value]);

  const thumbStyle = (val: number): CSSProperties => ({
    left: `calc(${valueToPercent(val, min, max)}% - ${THUMB_HIT_SIZE / 2}px)`,
    position: 'absolute',
    top: -Math.round((THUMB_HIT_SIZE - 6) / 2),
    cursor: 'pointer',
    width: THUMB_HIT_SIZE,
    height: THUMB_HIT_SIZE,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    touchAction: 'none',
  });

  const Thumb = ({ index, val }: { index: 0 | 1; val: number }) => (
    <div onPointerDown={startPointer(index)} style={thumbStyle(val)}>
      <div
        className={cn(
          'border-primary bg-background block size-4 shrink-0 rounded-full border shadow-sm',
          'transition-[box-shadow,transform] duration-75',
          'ring-ring/50 hover:ring-4',
          activeThumb === index && 'scale-110',
        )}
      />
    </div>
  );

  return (
    <div
      className={cn(
        'retro-slider relative w-full touch-none select-none',
        className,
      )}
    >
      <div className='relative'>
        <div
          ref={trackRef}
          className={cn(
            'bg-muted relative h-1.5 w-full overflow-hidden rounded-full',
            'touch-none',
          )}
          onPointerDown={startFromTrack}
        />
        {fixed ? (
          <div className='border-primary bg-primary/25 crt-glow-primary absolute top-[-6px] left-1/2 z-10 size-4 -translate-x-1/2 rounded-full border' />
        ) : (
          <>
            <div
              className='bg-primary absolute top-0 h-1.5 rounded-full'
              style={{
                left: `${valueToPercent(low, min, max)}%`,
                right: `${100 - valueToPercent(high, min, max)}%`,
              }}
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
