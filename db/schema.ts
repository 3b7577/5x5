import { pgTable, serial, bigint, smallint, index } from "drizzle-orm/pg-core";

export const bw25 = pgTable('bw25', {
    id: serial('id').primaryKey(),
    imgBits: bigint('img_bits', { mode: 'number' }).notNull(),
    tagBits: bigint('tag_bits', { mode: 'number' }).notNull(),
    blackCnt: smallint('black_cnt').notNull(),
}, (table) => [
    index('idx_black_cnt').on(table.blackCnt),
    index('idx_tag_bits').on(table.tagBits)
])