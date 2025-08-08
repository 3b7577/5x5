import { useEffect, useRef, type ComponentRef, type FC } from 'react';

import { cn } from '@/lib/utils';
import useThemeStore from '@/stores/useThemeStore';
import { getThemeConfig } from '@/theme';
import type { PatternMatrix } from '@/types';

interface CanvasPatternProps {
  pattern: PatternMatrix;
  cellSize?: number;
  className?: string;
}

const CanvasPattern: FC<CanvasPatternProps> = ({
  pattern,
  cellSize = 14,
  className = '',
}) => {
  const canvasRef = useRef<ComponentRef<'canvas'>>(null);
  const { variant } = useThemeStore();
  const themeConfig = getThemeConfig(variant);
  const canvasSize = cellSize * 5;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.imageSmoothingEnabled = false;

    canvas.width = canvasSize;
    canvas.height = canvasSize;
    canvas.style.width = `${canvasSize}px`;
    canvas.style.height = `${canvasSize}px`;

    const colors = {
      background: themeConfig.bgColor,
      filled: themeConfig.color,
      empty: themeConfig.cssVars.card,
      border: themeConfig.cssVars.border,
    };

    ctx.fillStyle = colors.background;
    ctx.fillRect(0, 0, canvasSize, canvasSize);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const x = col * cellSize;
        const y = row * cellSize;
        const filled = pattern[row][col] === 1;

        ctx.fillStyle = filled ? colors.filled : colors.empty;
        ctx.fillRect(x, y, cellSize, cellSize);

        ctx.strokeStyle = colors.border;
        ctx.lineWidth = 1;
        ctx.strokeRect(x + 0.5, y + 0.5, cellSize - 1, cellSize - 1);
      }
    }
  }, [pattern, cellSize, themeConfig]);

  return (
    <canvas
      ref={canvasRef}
      className={cn(
        'transition-all',
        themeConfig.styles.canvasHover,
        className,
      )}
      style={{
        width: canvasSize,
        height: canvasSize,
        imageRendering: 'pixelated',
      }}
    />
  );
};

export default CanvasPattern;
