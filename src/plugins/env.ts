import { FastifyPluginCallback } from 'fastify';
import fp from 'fastify-plugin';
import fastifyEnv from '@fastify/env';
import { EnvironmentSchema } from '../schemas/common/environment';

const envPlugin: FastifyPluginCallback = async function (fastify, options, next) {
  fastify.register(fastifyEnv, {
    dotenv: true,
    confKey: 'config',
    schema: EnvironmentSchema,
    data: process.env,
  });

  next();
};

declare module 'fastify' {
  export interface FastifyInstance {
    config: {
      PORT: number;
      NODE_ENV: string;
      MONGO_URL: string;
      ORIGINS: string;
    };
  }
}

export default fp(envPlugin);
