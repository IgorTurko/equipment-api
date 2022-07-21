import { FromSchema } from 'json-schema-to-ts';

import { EquipmentStatusEnum } from '../entities/Equipment';

export const EquipmentSchema = {
  type: 'object',
  nullable: false,
  required: ['code', 'address', 'start_date', 'end_date', 'status'],
  additionalProperties: false,
  properties: {
    code: {
      type: 'string',
      nullable: false,
      description: 'Unique equipment code',
    },
    address: {
      type: 'string',
      nullable: false,
      description: 'Address of equipment',
    },
    start_date: {
      type: ['null', 'string'],
      nullable: true,
      description: 'Date when equipment ran',
    },
    end_date: {
      type: ['null', 'string'],
      nullable: true,
      description: 'Date when equipment stopped',
    },
    status: {
      type: 'string',
      nullable: false,
      description: 'Status of equipment',
      enum: Object.values(EquipmentStatusEnum),
    },
  },
} as const;

export type EquipmentSchemaType = FromSchema<typeof EquipmentSchema>;
