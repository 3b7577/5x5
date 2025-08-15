import { pgTable, bigint, smallint } from 'drizzle-orm/pg-core';

export const bw25 = pgTable('bw25', {
  imgBits: bigint('img_bits', { mode: 'number' }).primaryKey(),
  tagBits: bigint('tag_bits', { mode: 'number' }).notNull(),
  blackCnt: smallint('black_cnt').notNull(),
});
