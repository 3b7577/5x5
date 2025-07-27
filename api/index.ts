import Fastify from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';
import imagesRoute from './routes/images.js';

const PORT = parseInt(process.env.PORT || '3000', 10);

const buildServer = async () => {
  const server = Fastify({
    logger: true,
  });

  await server.register(swagger, {
    openapi: {
      openapi: '3.0.0',
      info: {
        title: '5x5 Image API',
        description: 'API for 5x5 black and white images with tag filtering',
        version: '0.1.0',
      },
      servers: [
        {
          url: 'http://localhost:3000',
          description: 'Development server',
        },
      ],
    },
  });

  await server.register(swaggerUi, {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: false,
    },
    uiHooks: {
      onRequest: function (request, reply, next) {
        next();
      },
      preHandler: function (request, reply, next) {
        next();
      },
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject) => swaggerObject,
    transformSpecificationClone: true,
  });

  server.register(imagesRoute);

  return server;
};

const start = async function () {
  try {
    const server = await buildServer();
    await server.listen({ port: PORT, host: '0.0.0.0' });
    server.log.info(
      `Swagger documentation available at http://localhost:${PORT}/documentation`,
    );
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start();
