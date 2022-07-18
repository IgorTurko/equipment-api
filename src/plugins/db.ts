import { FastifyInstance } from 'fastify';
import { Collection } from 'mongodb';
import fp from 'fastify-plugin';
import { FastifyPluginCallback } from 'fastify';
import fastifyMongo from '@fastify/mongodb';
import { DbConnectionError } from '../errors';
import { Equipment } from '../entities/Equipment';

const EQUIPMENT_COLLECTION_NAME = 'equipment';

type Repositories = {
  equipment: Collection<Equipment>;
};

const getRepositories = async (fastify: FastifyInstance): Promise<Repositories> => {
  const db = fastify.mongo.db;

  if (!db) {
    throw new DbConnectionError('Can not connect to db');
  }

  const equipment = db.collection<Equipment>(EQUIPMENT_COLLECTION_NAME);
  await equipment.createIndex({ code: 1 }, { unique: true });

  return {
    equipment: equipment,
  };
};

const dbPlugin: FastifyPluginCallback = async function (fastify, overrideOptions, next) {
  fastify.register(fastifyMongo, {
    forceClose: true,
    url: fastify.config.MONGO_URL,
  });

  await fastify.after();

  fastify.decorate('repositories', await getRepositories(fastify));

  next();
};

declare module 'fastify' {
  export interface FastifyInstance {
    repositories: Repositories;
  }
}

export default fp(dbPlugin);
