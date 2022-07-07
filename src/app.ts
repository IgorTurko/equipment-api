import fastify from 'fastify';
import setup from './setup';

const app = fastify({
  logger: true,
});

const start = async () => {
  try {
    app.register(setup);
    await app.listen({ port: 3000 });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
