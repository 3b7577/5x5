import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import staticPlugin from '@fastify/static';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';

import imagesRoute from './routes/images.js';
import infoRoute from './routes/info.js';

const PORT = parseInt(process.env.PORT || '3000', 10);
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const buildServer = async () => {
  const server = Fastify({ logger: true });

  await server.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: { title: '5x5 Image API', version: '0.1.0' },
    },
  });
  await server.register(swaggerUi, { routePrefix: '/documentation' });

  server.register(imagesRoute, { prefix: '/api' });
  server.register(infoRoute, { prefix: '/api' });

  const distPath = path.resolve(__dirname, '../web');
  if (fs.existsSync(distPath)) {
    await server.register(staticPlugin, {
      root: distPath,
      prefix: '/',
      index: 'index.html',
    });

    server.setNotFoundHandler((req, reply) => {
      const url = req.raw.url || '';
      if (!url.startsWith('/api') && !url.startsWith('/documentation')) {
        return reply.sendFile('index.html');
      }
      reply.code(404).send({ error: 'Not found' });
    });
  } else {
    server.log.warn(`⚠️ No web build found at ${distPath}.`);
  }

  return server;
};

const start = async () => {
  const server = await buildServer();
  await server.listen({ port: PORT, host: '0.0.0.0' });
};

start().catch((err) => {
  console.error(err);
  process.exit(1);
});
