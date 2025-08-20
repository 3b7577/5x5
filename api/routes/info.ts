import { FastifyPluginAsync } from 'fastify';
import { db } from '../../db/client.js';
import { bw25 } from '../../db/schema.js';
import { sql } from 'drizzle-orm';

const infoRoute: FastifyPluginAsync = async (fastify) => {
  fastify.get(
    '/api/info',
    {
      schema: {
        description: 'General info about the dataset and constraints',
        tags: ['info'],
        response: {
          200: {
            type: 'object',
            properties: {
              density: {
                type: 'object',
                properties: {
                  min: { type: 'number' },
                  max: { type: 'number' },
                },
                required: ['min', 'max'],
              },
            },
            required: ['density'],
          },
        },
      },
    },
    async (_req, reply) => {
      try {
        const [{ min, max }] = await db
          .select({
            min: sql<number>`min(${bw25.blackCnt})`,
            max: sql<number>`max(${bw25.blackCnt})`,
          })
          .from(bw25);

        const densityMin = Number.isFinite(min) ? (min as number) : 0;
        const densityMax = Number.isFinite(max) ? (max as number) : 25;

        return {
          density: { min: densityMin, max: densityMax },
        };
      } catch (error) {
        fastify.log.error(error);
        return reply.status(500).send({ error: 'Internal server error' });
      }
    },
  );
};

export default infoRoute;
