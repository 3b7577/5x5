import { FastifyPluginAsync } from 'fastify';
import { db } from '../../db/client.js';
import { bw25 } from '../../db/schema.js';
import { BIT, isTagKey } from '@shared/tags.js';
import {
  and,
  asc,
  desc,
  eq,
  gt,
  gte,
  lt,
  lte,
  or,
  SQL,
  sql,
} from 'drizzle-orm';

type GET_IMAGES_QUERY = {
  tags?: string;
  densityMin?: number;
  densityMax?: number;
  cursor?: string;
  sortBy?: 'blackCnt' | 'imgBits';
  sortOrder?: 'asc' | 'desc';
};

type Cursor = { blackCnt: number; imgBits: number };

const LIMIT = 50;

const encodeCursor = (cursor: Cursor): string => {
  return `${cursor.blackCnt}_${cursor.imgBits}`;
};

const decodeCursor = (cursor: string): Cursor => {
  if (!cursor) {
    return { blackCnt: 0, imgBits: 0 };
  }

  const [blackCnt, imgBits] = cursor.split('_');

  if (!blackCnt || !imgBits) {
    throw new Error('Invalid cursor');
  }

  return { blackCnt: parseInt(blackCnt), imgBits: parseInt(imgBits) };
};

const imagesRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/images',
    {
      schema: {
        description: 'Get 5x5 images filtered by tags and density',
        tags: ['images'],
        querystring: {
          type: 'object',
          properties: {
            tags: {
              type: 'string',
              description: 'Comma-separated list of tags to filter by',
            },
            densityMin: {
              type: 'number',
              description: 'Minimum black pixel count (0-25)',
              default: 0,
            },
            densityMax: {
              type: 'number',
              description: 'Maximum black pixel count (0-25)',
              default: 25,
            },
            sortBy: {
              type: 'string',
              description: 'Sort by',
              enum: ['blackCnt', 'imgBits'],
              default: 'blackCnt',
            },
            sortOrder: {
              type: 'string',
              description: 'Sort order',
              enum: ['asc', 'desc'],
              default: 'asc',
            },
            cursor: {
              type: 'string',
              description: 'Cursor to start from',
            },
          },
        },
        response: {
          200: {
            type: 'object',
            properties: {
              images: {
                type: 'array',
                items: {
                  type: 'object',
                  properties: {
                    imgBits: { type: 'number' },
                    tagBits: { type: 'number' },
                    blackCnt: { type: 'number' },
                  },
                },
              },
              nextCursor: { type: 'string' },
              hasMore: { type: 'boolean' },
              totalCount: { type: 'number' },
            },
          },
        },
      },
    },
    async (req, reply) => {
      const {
        tags,
        densityMin = 0,
        densityMax = 25,
        cursor = '',
        sortBy = 'blackCnt',
        sortOrder = 'asc',
      } = req.query as GET_IMAGES_QUERY;
      try {
        const conditions: (SQL<unknown> | undefined)[] = [
          gte(bw25.blackCnt, densityMin),
          lte(bw25.blackCnt, densityMax),
        ];

        if (tags) {
          const tagNames = tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean);

          const bitmask = tagNames.reduce((acc, tag) => {
            if (!isTagKey(tag)) throw new Error(`Unknown tag: ${tag}`);

            return acc | BIT[tag];
          }, 0n);

          conditions.push(sql`${bw25.tagBits} & ${bitmask} = ${bitmask}`);
        }

        const orderDirection = sortOrder === 'asc' ? asc : desc;
        const cursorDirection = sortOrder === 'asc' ? gt : lt;

        const order =
          sortBy === 'blackCnt'
            ? [orderDirection(bw25.blackCnt), orderDirection(bw25.imgBits)]
            : [orderDirection(bw25.imgBits), orderDirection(bw25.blackCnt)];

        const { primary, secondary } =
          sortBy === 'blackCnt'
            ? { primary: bw25.blackCnt, secondary: bw25.imgBits }
            : { primary: bw25.imgBits, secondary: bw25.blackCnt };

        const isFirstCursor =
          !cursor || cursor === encodeCursor({ imgBits: 0, blackCnt: 0 });

        if (!isFirstCursor) {
          const { blackCnt, imgBits } = decodeCursor(cursor);

          const primaryValue = sortBy === 'blackCnt' ? blackCnt : imgBits;
          const secondaryValue = sortBy === 'blackCnt' ? imgBits : blackCnt;

          const primaryCondition = cursorDirection(primary, primaryValue);
          const secondaryCondition = cursorDirection(secondary, secondaryValue);
          const equalCondition = eq(primary, primaryValue);

          conditions.push(
            or(primaryCondition, and(equalCondition, secondaryCondition)),
          );
        }

        const query = db
          .select()
          .from(bw25)
          .orderBy(...order)
          .where(and(...conditions))
          .limit(LIMIT + 1);

        const results = await query;

        const hasMoreResults = results.length > LIMIT;
        if (hasMoreResults) {
          results.pop();
        }

        const [{ count: totalCount } = { count: 0 }] = await db
          .select({ count: sql<number>`count(*)` })
          .from(bw25)
          .where(and(...conditions));

        const nextCursor = hasMoreResults
          ? encodeCursor({
              blackCnt: results.at(-1)!.blackCnt,
              imgBits: results.at(-1)!.imgBits,
            })
          : null;

        return {
          images: results.map((row) => ({
            imgBits: row.imgBits,
            tagBits: row.tagBits,
            blackCnt: row.blackCnt,
          })),
          nextCursor,
          totalCount,
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );
};

export default imagesRoute;
