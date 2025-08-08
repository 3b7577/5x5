import { TAGS } from '@shared/tags';

import type { ApiResponse, PatternMatrix } from '@/types';

export interface FetchImagesParams {
  tags?: string[];
  densityMin?: number;
  densityMax?: number;
  cursor?: string;
  sortBy?: 'blackCnt' | 'imgBits';
  sortOrder?: 'asc' | 'desc';
}

export const imgBitsToPattern = (imgBits: number): PatternMatrix => {
  const pattern: PatternMatrix = [];
  for (let i = 0; i < 5; i++) {
    const row: number[] = [];
    for (let j = 0; j < 5; j++) {
      // Match Rust implementation: bit 24 is top-left (0,0), bit 0 is bottom-right (4,4)
      const bitIndex = 24 - (i * 5 + j);
      row.push((imgBits & (1 << bitIndex)) !== 0 ? 1 : 0);
    }
    pattern.push(row);
  }
  return pattern;
};

export const tagBitsToTags = (tagBits: number): string[] => {
  const tags: string[] = [];

  for (const tag of TAGS) {
    if ((BigInt(tagBits) & tag.bit) === tag.bit) {
      tags.push(tag.key);
    }
  }

  return tags;
};

export const fetchImages = async (
  params: FetchImagesParams,
): Promise<ApiResponse> => {
  const searchParams = new window.URLSearchParams();

  if (params.tags && params.tags.length > 0) {
    searchParams.set('tags', params.tags.join(','));
  }

  if (params.densityMin !== undefined) {
    searchParams.set('densityMin', params.densityMin.toString());
  }

  if (params.densityMax !== undefined) {
    searchParams.set('densityMax', params.densityMax.toString());
  }

  if (params.cursor) {
    searchParams.set('cursor', params.cursor);
  }

  if (params.sortBy) {
    searchParams.set('sortBy', params.sortBy);
  }

  if (params.sortOrder) {
    searchParams.set('sortOrder', params.sortOrder);
  }

  const response = await window.fetch(`/api/images?${searchParams.toString()}`);

  if (!response.ok) {
    throw new Error(`Failed to fetch images: ${response.statusText}`);
  }

  return response.json();
};
