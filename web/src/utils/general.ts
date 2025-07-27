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
  items: T[],
  by: K,
): Record<string, T[]>;

export function groupBy<T extends Record<string, unknown>, K extends keyof T>(
  items: T[],
  by: K,
  options: { exclude: true },
): Record<string, Omit<T, K>[]>;

export function groupBy<T extends Record<string, unknown>, K extends keyof T>(
  items: T[],
  by: K,
  options: { exclude: false },
): Record<string, T[]>;

export function groupBy<T extends Record<string, unknown>, K extends keyof T>(
  items: T[],
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
