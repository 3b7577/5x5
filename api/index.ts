import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import staticPlugin from '@fastify/static';
import path from 'node:path';
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
      info: {
        title: '5x5 Image API',
        description: 'API for 5x5 black and white images with tag filtering',
        version: '0.1.0',
      },
      servers: [{ url: `http://localhost:${PORT}`, description: 'Dev server' }],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/documentation',
    staticCSP: true,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });

  server.register(imagesRoute, { prefix: '/api' });
  server.register(infoRoute, { prefix: '/api' });

  const distPath = path.resolve(__dirname, '../../web/dist');
  await server.register(staticPlugin, {
    root: distPath,
    prefix: '/',
    index: 'index.html',
  });

  server.setNotFoundHandler((req, reply) => {
    if (
      req.raw.url &&
      !req.raw.url.startsWith('/api') &&
      !req.raw.url.startsWith('/documentation')
    ) {
      return reply.sendFile('index.html');
    }
    reply.status(404).send({ error: 'Not found' });
  });

  return server;
};

const start = async function () {
  try {
    const server = await buildServer();
    await server.listen({ port: PORT, host: '0.0.0.0' });
    server.log.info(`Running on http://localhost:${PORT}`);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
