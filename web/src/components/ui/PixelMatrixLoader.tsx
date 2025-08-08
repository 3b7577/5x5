import { useMemo, type FC } from 'react';
import { TAGS } from '@shared/tags';

import { CATEGORY_PATTERNS, type FillPattern } from '@/lib/animationPatterns';
import { usePixelMatrixAnimation } from '@/hooks/usePixelMatrixAnimation';
import useFiltersStore from '@/stores/useFiltersStore';
import useThemeStore from '@/stores/useThemeStore';
import { useThemeContext } from '@/theme';

interface PixelMatrixLoaderProps {
  size?: number;
  className?: string;
  isResetting?: boolean;
}

const PixelMatrixLoader: FC<PixelMatrixLoaderProps> = ({
  size = 120,
  className = '',
  isResetting = false,
}) => {
  const { variant } = useThemeStore();
  const { selectedTags } = useFiltersStore();
  const { config: themeConfig, texts } = useThemeContext(variant);

  // Determine fill pattern based on last selected tag
  const fillPattern = useMemo((): FillPattern => {
    if (selectedTags.length === 0) return 'sequential';

    const lastSelectedTagKey = selectedTags[selectedTags.length - 1];
    const lastSelectedTag = TAGS.find((t) => t.key === lastSelectedTagKey);

    if (!lastSelectedTag) return 'sequential';

    const pattern = CATEGORY_PATTERNS[lastSelectedTag.category];

    return pattern || 'sequential';
  }, [selectedTags]);

  const { currentPattern, scanLine, isScanning, isFlashing, resetPhase } =
    usePixelMatrixAnimation({
      isResetting,
      fillPattern,
    });

  const gridSize = currentPattern.length || 1;
  const cellSize = Math.floor(size / gridSize);
  const containerBorder = Math.max(1, Math.round(cellSize * 0.1));
  const cellBorder = Math.max(1, Math.round(cellSize * 0.08));
  const scanThickness = Math.max(1, Math.round(cellSize * 0.12));
  const scanStepMs = Math.max(50, Math.round(1200 / (gridSize + 1)));
  const scanTop = Math.max(
    0,
    Math.min(
      scanLine * cellSize - Math.floor(scanThickness / 2),
      size - scanThickness,
    ),
  );

  const backgroundColor = themeConfig.loadingColors.background;
  const filledColor = themeConfig.loadingColors.primary;
  const emptyColor = themeConfig.cssVars.card;
  const borderColor = themeConfig.cssVars.border;
  const scanColor = `${themeConfig.loadingColors.secondary}80`;

  const getLoadingTitle = (): string => {
    if (isResetting) {
      switch (resetPhase) {
        case 'flash':
          return texts.systemReset;
        case 'clear':
          return texts.clearingMemory;
        case 'complete':
          return texts.resetComplete;
        default:
          return texts.loadingPatterns;
      }
    }

    if (isScanning) {
      return texts.scanningMatrix;
    }

    return texts.loadingPatterns;
  };

  const getLoadingSubtext = (): string => {
    if (isResetting) {
      switch (resetPhase) {
        case 'flash':
          return texts.flushingData;
        case 'clear':
          return texts.purgingSelections;
        case 'complete':
          return texts.filtersCleared;
        default:
          return texts.initializingDb;
      }
    }

    if (selectedTags.length > 0) {
      return texts.applyingFilters(selectedTags.length);
    }

    return texts.initializingDb;
  };

  return (
    <div className={`flex flex-col items-center gap-4 ${className}`}>
      <div
        className='relative'
        style={{
          width: size,
          height: size,
          backgroundColor,
          border: `${containerBorder}px solid ${borderColor}`,
          imageRendering: 'pixelated',
        }}
      >
        {currentPattern.map((row, rowIndex) =>
          row.map((filled, colIndex) => {
            const shouldShow = isResetting && isFlashing ? !filled : filled;
            return (
              <div
                key={`${rowIndex}-${colIndex}`}
                style={{
                  position: 'absolute',
                  left: colIndex * cellSize,
                  top: rowIndex * cellSize,
                  width: cellSize,
                  height: cellSize,
                  backgroundColor: shouldShow ? filledColor : emptyColor,
                  border: `${cellBorder}px solid ${borderColor}`,
                  boxSizing: 'border-box',
                }}
              />
            );
          }),
        )}

        {isScanning && (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: scanTop,
              width: '100%',
              height: scanThickness,
              backgroundColor: scanColor,
              transition: `top ${scanStepMs}ms linear`,
              zIndex: 10,
            }}
          />
        )}
      </div>

      <div className='text-center'>
        <div
          className={`text-primary mb-1 text-sm font-bold tracking-wide ${themeConfig.styles.title}`}
        >
          {getLoadingTitle()}
        </div>
        <div
          className={`text-muted-foreground text-xs ${themeConfig.styles.body}`}
        >
          {getLoadingSubtext()}
        </div>
      </div>
    </div>
  );
};

export default PixelMatrixLoader;
