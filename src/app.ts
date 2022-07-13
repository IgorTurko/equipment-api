import fastify from 'fastify';
import setup from './setup';

const app = fastify({
  logger: true,
});

const { PORT = 3000 } = process.env;

const start = async () => {
  try {
    const port: number = typeof PORT === 'number' ? PORT : parseInt(PORT, 10);

    app.register(setup);
    await app.listen({ port });
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();
