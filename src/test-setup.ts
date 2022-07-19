import fastify, { FastifyInstance } from 'fastify';
import setup from './setup';

export async function initApp(): Promise<FastifyInstance> {
  const app = fastify({
    logger: true,
  });

  await app.register(setup);

  try {
    await app.ready();
  } catch (e) {
    console.error('Can not register fasify app because of:', e);
    throw e;
  }

  return app;
}
