import type { TagKey } from '@shared/tags';

export type Range = [number, number];
export type Matrix<T> = T[][];
export type PatternMatrix = Matrix<number>;

export interface Pattern {
  id: number;
  matrix: PatternMatrix;
  density: number;
  tags: TagKey[];
}

export interface ApiImage {
  imgBits: number;
  tagBits: number;
  blackCnt: number;
}

export interface ApiResponse {
  images: ApiImage[];
  nextCursor: string | null;
  totalCount: number;
}
