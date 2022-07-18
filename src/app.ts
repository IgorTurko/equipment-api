import fastify from 'fastify';
import setup from './setup';

const app = fastify({
  logger: true,
});

const start = async () => {
  try {
    app.register(setup);
    await app.ready().then(() => {
      app.listen({ port: app.config.PORT });
    });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
