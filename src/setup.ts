import { FastifyInstance, FastifyPluginCallback } from 'fastify';
import fastifyCors from '@fastify/cors';
import fastifySensible from '@fastify/sensible';
import fp from 'fastify-plugin';

import { handleApplicationErrors } from './errors';
//import outreachTasks, { PREFIX_URL as OUTREACH_PREFIX } from './api/v1/outreachTasks';

const setup: FastifyPluginCallback = async function (app, opts, next) {
  // Default error handler called whenever an error happens
  // by default plugin based error handler should be triggered
  // if plugin has no local `setErrorHandler`
  // then this one should handle all errors
  app.setErrorHandler((error, request, reply) => {
    handleApplicationErrors(app, error, request, reply);
  });

  // allow to have http errors like: reply.notFound(), fastify.httpErrors.notFound()
  app.register(fastifySensible);

  const origins = (process.env.ORIGINS || '').split(',');
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

  //app.register(outreachTasks, { prefix: OUTREACH_PREFIX });
};

export default fp(setup);
