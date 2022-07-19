import { FastifyPluginCallback } from 'fastify';
import { MongoError } from 'mongodb';
import { handleApplicationErrors, NotFoundError, ValidationError } from '../../errors';
import { Equipment } from '../../entities/Equipment';
import { EquipmentSchema } from '../../schemas/EquipmentSchema';
import {
  IdUrlParamSchema,
  IdUrlParamSchemaType,
  WithLimitQuerystringSchema,
  WithLimitQuerystringSchemaType,
} from '../../schemas/common/params';

export const PREFIX_URL = '/v1/equipment';
export default <FastifyPluginCallback>function routes(fastify, _options, next): void {
  fastify.setErrorHandler((error, request, reply) => {
    handleApplicationErrors(fastify, error, request, reply);
  });

  fastify.route<{
    Querystring: WithLimitQuerystringSchemaType;
    Reply: { data: Equipment[] };
  }>({
    method: 'GET',
    url: '/',
    schema: {
      querystring: WithLimitQuerystringSchema,
      response: {
        200: {
          data: { type: 'array', nullable: false, items: EquipmentSchema },
        },
      },
    },
    handler: async (request, reply) => {
      const { limit = 1000 } = request.query;

      const equipment = await fastify.repositories.equipment.find().limit(limit).toArray();

      reply.code(200).send({ data: equipment });
    },
  });

  fastify.route<{
    Params: IdUrlParamSchemaType;
    Reply: { data: Equipment };
  }>({
    method: 'GET',
    url: '/:id',
    schema: {
      params: IdUrlParamSchema,
      response: {
        200: {
          data: EquipmentSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const { id } = request.params;
      const equipmentItem = await fastify.repositories.equipment.findOne({ code: id });
      if (!equipmentItem) {
        throw new NotFoundError('Equipment not found', id);
      }

      reply.code(200).send({ data: equipmentItem });
    },
  });

  fastify.route<{
    Body: Equipment;
    Reply: { data: Equipment };
  }>({
    method: 'POST',
    url: '/',
    schema: {
      body: EquipmentSchema,
      response: {
        201: {
          data: EquipmentSchema,
        },
      },
    },
    handler: async (request, reply) => {
      const newEquipment = request.body;

      try {
        await fastify.repositories.equipment.insertOne(request.body);

        return reply.code(201).send({ data: newEquipment });
      } catch (e) {
        if (e instanceof MongoError && e.code === 11000) {
          throw new ValidationError(`Equipment with code ${newEquipment.code} already exists`);
        }

        fastify.log.error(e);
        throw e;
      }
    },
  });

  next();
};
