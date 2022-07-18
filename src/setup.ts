import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fp from 'fastify-plugin';

import { handleApplicationErrors } from './errors';
import equipment, { PREFIX_URL } from './api/v1/equipment';
import envPlugin from './plugins/env';
import dbPlugin from './plugins/db';

const setup: FastifyPluginCallback = async function (app, opts, next) {
  // Default error handler called whenever an error happens
  // by default plugin based error handler should be triggered
  // if plugin has no local `setErrorHandler`
  // then this one should handle all errors
  app.setErrorHandler((error, request, reply) => {
    handleApplicationErrors(app, error, request, reply);
  });

  await app.register(envPlugin);

  app.register(dbPlugin);

  // allow to have http errors like: reply.notFound(), fastify.httpErrors.notFound()
  app.register(fastifySensible);

  const origins = (app.config.ORIGINS || '').split(',');
  app.register(fastifyCors, {
    origin: origins,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    maxAge: 13000,
    optionsSuccessStatus: 200,
  });

  registerEndpoints(app);

  app.after(async (err: Error) => {
    if (err) {
      app.log.error(err, 'Fastify setup failed');
    }
  });

  next();
};

const registerEndpoints = (app: FastifyInstance) => {
  app.get('/', { schema: { hide: true } }, (request, reply) => {
    reply.code(200).send('This is root of an API service, nothing to see here!');
  });

  app.register(equipment, { prefix: PREFIX_URL });
};

export default fp(setup);
