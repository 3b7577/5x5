import { useEffect, useReducer, useRef } from 'react';

import {
  getPatternGroups,
  MATRIX_SIZE,
  type FillPattern,
} from '@/lib/animationPatterns';
import { computeIntervalMs, createMatrix } from '@/lib/utils';
import usePatternsStore from '@/stores/usePatternsStore';

class AnimationController {
  private timeoutIds: number[] = [];
  private intervalIds: number[] = [];
  schedule(fn: () => void, delay: number) {
    const id = window.setTimeout(fn, delay);
    this.timeoutIds.push(id);
  }
  repeat(fn: () => void, interval: number) {
    const id = window.setInterval(fn, interval);
    this.intervalIds.push(id);
  }
  clear() {
    this.timeoutIds.forEach((id) => clearTimeout(id));
    this.intervalIds.forEach((id) => clearInterval(id));
    this.timeoutIds = [];
    this.intervalIds = [];
  }
}

type ResetPhase = 'flash' | 'clear' | 'complete' | 'loading';

interface UsePixelMatrixAnimationProps {
  isResetting: boolean;
  fillPattern: FillPattern;
  matrixSize?: number;
}

interface AnimationState {
  currentPattern: boolean[][];
  scanLine: number;
  isScanning: boolean;
  isFlashing: boolean;
  resetPhase: ResetPhase;
}

const BASE_FLASH_COUNT = 6;
const TARGET_FLASH_DURATION = 600; // total duration of flash phase
const TARGET_CLEAR_DURATION = 800; // total duration of clear phase
const TARGET_FILL_DURATION = 900; // total duration of fill phase
const TARGET_SCAN_DURATION = 1200; // time for one full scan pass
const COMPLETE_DELAY = 800; // delay before switching from reset to loading

type Action =
  | { type: 'SET_MATRIX'; value: boolean }
  | { type: 'FILL_CELLS'; coords: [number, number][] }
  | { type: 'CLEAR_CELLS'; coords: [number, number][] }
  | { type: 'TOGGLE_FLASH' }
  | { type: 'SET_FLASH'; value: boolean }
  | { type: 'SET_PHASE'; phase: ResetPhase }
  | { type: 'SET_SCANNING'; value: boolean }
  | { type: 'INCREMENT_SCAN'; size: number };

function reducer(state: AnimationState, action: Action): AnimationState {
  switch (action.type) {
    case 'SET_MATRIX':
      return {
        ...state,
        currentPattern: createMatrix(state.currentPattern.length, action.value),
      };
    case 'FILL_CELLS':
      return {
        ...state,
        currentPattern: state.currentPattern.map((row, r) =>
          row.map(
            (cell, c) =>
              cell || action.coords.some(([rr, cc]) => rr === r && cc === c),
          ),
        ),
      };
    case 'CLEAR_CELLS':
      return {
        ...state,
        currentPattern: state.currentPattern.map((row, r) =>
          row.map((cell, c) =>
            action.coords.some(([rr, cc]) => rr === r && cc === c)
              ? false
              : cell,
          ),
        ),
      };
    case 'TOGGLE_FLASH':
      return { ...state, isFlashing: !state.isFlashing };
    case 'SET_FLASH':
      return { ...state, isFlashing: action.value };
    case 'SET_PHASE':
      return { ...state, resetPhase: action.phase };
    case 'SET_SCANNING':
      return { ...state, isScanning: action.value };
    case 'INCREMENT_SCAN':
      return { ...state, scanLine: (state.scanLine + 1) % (action.size + 1) };
    default:
      return state;
  }
}

export function usePixelMatrixAnimation({
  isResetting,
  fillPattern,
  matrixSize = MATRIX_SIZE,
}: UsePixelMatrixAnimationProps): AnimationState {
  const { isLoading } = usePatternsStore();
  const controller = useRef(new AnimationController()).current;
  const cancelled = useRef(false);

  const initial: AnimationState = {
    currentPattern: createMatrix(matrixSize, false),
    scanLine: 0,
    isScanning: false,
    isFlashing: false,
    resetPhase: 'flash',
  };
  const [state, dispatch] = useReducer(reducer, initial);

  const setMatrix = (val: boolean) =>
    dispatch({ type: 'SET_MATRIX', value: val });

  // 1. Reset animation
  useEffect(() => {
    if (!isResetting) return;
    cancelled.current = false;
    controller.clear();

    async function runReset() {
      setMatrix(true);
      dispatch({ type: 'SET_PHASE', phase: 'flash' });
      dispatch({ type: 'SET_FLASH', value: true });

      // Flash phase
      await new Promise<void>((res) => {
        let count = 0;

        const flashInterval = computeIntervalMs(
          TARGET_FLASH_DURATION,
          BASE_FLASH_COUNT,
          40,
        );

        controller.repeat(() => {
          if (cancelled.current || count++ >= BASE_FLASH_COUNT) {
            controller.clear();
            dispatch({ type: 'SET_FLASH', value: false });
            res();
          } else {
            dispatch({ type: 'TOGGLE_FLASH' });
          }
        }, flashInterval);
      });
      if (cancelled.current) return;

      // Clear phase
      dispatch({ type: 'SET_PHASE', phase: 'clear' });
      await new Promise<void>((res) => {
        const seq = getPatternGroups('clear');
        let idx = 0;

        const clearInterval = computeIntervalMs(
          TARGET_CLEAR_DURATION,
          seq.length,
          30,
        );

        controller.repeat(() => {
          if (cancelled.current) {
            controller.clear();
            res();
            return;
          }

          if (idx < seq.length) {
            dispatch({ type: 'CLEAR_CELLS', coords: seq[idx++] });
          } else {
            controller.clear();
            res();
          }
        }, clearInterval);
      });
      if (cancelled.current) return;

      // Complete phase
      dispatch({ type: 'SET_PHASE', phase: 'complete' });
      await new Promise<void>((res) => {
        controller.schedule(() => {
          if (!cancelled.current) {
            dispatch({ type: 'SET_PHASE', phase: 'loading' });
            setMatrix(false);
          }

          res();
        }, COMPLETE_DELAY);
      });
    }

    runReset();

    return () => {
      cancelled.current = true;
      controller.clear();
    };
  }, [isResetting, matrixSize]);

  // 2. Fill then scan
  useEffect(() => {
    if (isResetting && state.resetPhase !== 'loading') return;

    controller.clear();
    setMatrix(false);
    dispatch({ type: 'SET_SCANNING', value: false });
    dispatch({ type: 'SET_PHASE', phase: 'loading' });

    const waves = getPatternGroups(fillPattern);
    let idx = 0;

    const fillInterval = computeIntervalMs(
      TARGET_FILL_DURATION,
      waves.length,
      25,
    );

    controller.repeat(() => {
      if (idx < waves.length) {
        dispatch({ type: 'FILL_CELLS', coords: waves[idx++] });
      } else {
        controller.clear();
        dispatch({ type: 'SET_SCANNING', value: true });
      }
    }, fillInterval);

    return () => controller.clear();
  }, [fillPattern, isResetting, state.resetPhase, matrixSize]);

  // 3. Scan-line
  useEffect(() => {
    if (!state.isScanning) return;

    if (!isLoading) {
      controller.clear();
      dispatch({ type: 'SET_SCANNING', value: false });
      dispatch({ type: 'INCREMENT_SCAN', size: matrixSize });
      return;
    }

    const scanInterval = computeIntervalMs(
      TARGET_SCAN_DURATION,
      matrixSize + 1,
      16,
    );

    controller.repeat(
      () => dispatch({ type: 'INCREMENT_SCAN', size: matrixSize }),
      scanInterval,
    );

    return () => controller.clear();
  }, [state.isScanning, isLoading, matrixSize]);

  return state;
}
