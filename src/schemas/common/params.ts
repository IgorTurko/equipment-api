import { FromSchema } from 'json-schema-to-ts';

export const IdUrlParamSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: {
      type: 'string',
    },
  },
} as const;

export type IdUrlParamSchemaType = FromSchema<typeof IdUrlParamSchema>;

export const WithLimitQuerystringSchema = {
  type: 'object',
  properties: {
    limit: {
      type: 'integer',
    },
  },
} as const;

export type WithLimitQuerystringSchemaType = FromSchema<typeof WithLimitQuerystringSchema>;
