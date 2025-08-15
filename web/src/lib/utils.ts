import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

import type { Matrix, Range } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const areArraysEqual = <T>(arr1: T[], arr2: T[]) =>
  arr1.every((el, i) => el === arr2[i]);

export const omit = <T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  key: K,
): Omit<T, K> =>
  Object.fromEntries(Object.entries(obj).filter(([k]) => k !== key)) as Omit<
    T,
    K
  >;

export function groupBy<T extends Record<string, unknown>, K extends keyof T>(
  items: ReadonlyArray<T>,
  by: K,
): Record<string, T[]>;

export function groupBy<T extends Record<string, unknown>, K extends keyof T>(
  items: ReadonlyArray<T>,
  by: K,
  options: { exclude: true },
): Record<string, Omit<T, K>[]>;

export function groupBy<T extends Record<string, unknown>, K extends keyof T>(
  items: ReadonlyArray<T>,
  by: K,
  options: { exclude: false },
): Record<string, T[]>;

export function groupBy<T extends Record<string, unknown>, K extends keyof T>(
  items: ReadonlyArray<T>,
  by: K,
  options?: { exclude: boolean },
) {
  const result = {} as Record<string, (T | Omit<T, K>)[]>;

  for (const item of items) {
    const key = String(item[by]);
    const parsedItem = options?.exclude ? omit(item, by) : item;

    if (result[key]) {
      result[key].push(parsedItem);
    } else {
      result[key] = [parsedItem];
    }
  }

  return result;
}

export const sortRange = (range: Range): Range => [
  Math.min(...range),
  Math.max(...range),
];

export const pluralize = (
  str: string,
  count: number,
  full?: boolean,
): string => {
  if (full) {
    return `${count} ${count === 1 ? str : `${str}s`}`;
  }

  return count === 1 ? str : `${str}s`;
};

export const createMatrix = <T>(length: number, value: T): Matrix<T> =>
  Array.from({ length }, () => Array(length).fill(value));

/**
 * Derives a per-step interval (ms) from a target total duration and a step count,
 * clamped to a minimum interval to avoid overly fast timers.
 */
export const computeIntervalMs = (
  targetTotalDurationMs: number,
  stepCount: number,
  minimumIntervalMs: number,
): number => {
  const safeStepCount = Math.max(stepCount, 1);
  const rawInterval = Math.round(targetTotalDurationMs / safeStepCount);
  return Math.max(minimumIntervalMs, rawInterval);
};

export const formatDensity = (density: number) =>
  `${density.toString().padStart(2, '0')}/25`;

export const densityValues = (min: number, max: number) => ({
  min: `MIN: ${min.toString().padStart(2, '0')}`,
  max: `MAX: ${max.toString().padStart(2, '0')}`,
});
