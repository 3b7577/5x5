export type Range = [number, number];
export type Matrix<T> = T[][];
export type PatternMatrix = Matrix<number>;

export interface Pattern {
  id: number;
  pattern: PatternMatrix;
  density: number;
  tags: string[];
}

// API Response types
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
