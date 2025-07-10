import { pgTable, bigint, smallint, index } from 'drizzle-orm/pg-core';

export const bw25 = pgTable(
  'bw25',
  {
    imgBits: bigint('img_bits', { mode: 'number' }).primaryKey(),
    tagBits: bigint('tag_bits', { mode: 'number' }).notNull(),
    blackCnt: smallint('black_cnt').notNull(),
  },
  (table) => [
    index('idx_img_bits').on(table.imgBits),
    index('idx_tag_bits').on(table.tagBits),
    index('idx_black_cnt').on(table.blackCnt),
  ],
);
