export const EnvironmentSchema = {
  type: 'object',
  required: ['PORT', 'NODE_ENV', 'MONGO_URL'],
  properties: {
    PORT: {
      type: 'integer',
      default: 3000,
    },
    NODE_ENV: { type: 'string' },
    MONGO_URL: { type: 'string' },
    ORIGINS: { type: 'string' },
    HOST: { type: 'string' },
  },
} as const;
