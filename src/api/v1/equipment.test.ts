import anyTest, { TestFn } from 'ava';
import { FastifyInstance } from 'fastify';
import { omit } from 'lodash';
import { EquipmentStatusEnum } from '../../entities/Equipment';
import { initApp } from '../../test-setup';

const EQUIPMENT_URL = '/v1/equipment';
const equipmentItem1 = {
  code: 'foo1',
  address: 'faa1',
  start_date: '2022-12-18',
  end_date: '2022-12-19',
  status: EquipmentStatusEnum.STOPPED,
};
const equipmentItem2 = {
  code: 'foo2',
  address: 'faa2',
  start_date: '2022-11-18',
  end_date: '2022-11-21',
  status: EquipmentStatusEnum.RUNNING,
};

const test = anyTest as TestFn<{
  app: FastifyInstance;
}>;

test.before(async (t) => {
  const app = await initApp();
  t.context = {
    app,
  };

  await t.context.app.repositories.equipment.deleteMany({});

  await app.repositories.equipment.insertMany([equipmentItem1, equipmentItem2]);
});

test.after(async (t) => {
  await t.context.app.close();
});

test('GET /equipment?limit=x should return list of equipment successfully', async (t) => {
  const { app } = t.context;

  const response1 = await app.inject({
    method: 'GET',
    url: `${EQUIPMENT_URL}`,
    query: { limit: '1' },
  });

  t.is(response1.statusCode, 200);

  const { data: result1 } = response1.json();
  t.is(result1.length, 1);

  const response2 = await app.inject({
    method: 'GET',
    url: `${EQUIPMENT_URL}`,
    query: { limit: '2' },
  });

  t.is(response2.statusCode, 200);

  const { data: result2 } = response2.json();
  t.is(result2.length, 2);
});

test('GET /equipment/:id should return one particular equipment item successfully', async (t) => {
  const { app } = t.context;

  const response = await app.inject({
    method: 'GET',
    url: `${EQUIPMENT_URL}/${equipmentItem1.code}`,
  });

  t.is(response.statusCode, 200);

  const { data: result } = response.json();

  t.deepEqual(result, omit(equipmentItem1, ['_id']));
});

test('POST /equipment should create equipment item successfully', async (t) => {
  const { app } = t.context;

  const newEquipmentItem = {
    code: 'foo3',
    address: 'faa3',
    start_date: '2022-12-18',
    end_date: '2022-12-21',
    status: EquipmentStatusEnum.STOPPED,
  };

  const response = await app.inject({
    method: 'POST',
    url: `${EQUIPMENT_URL}`,
    payload: newEquipmentItem,
  });

  t.is(response.statusCode, 201);

  const { data: result } = response.json();

  t.deepEqual(result, newEquipmentItem);
});

test('POST /equipment should fail when equipment exists', async (t) => {
  const { app } = t.context;

  const newEquipmentItem = {
    code: 'foo4',
    address: 'faa4',
    start_date: '2022-12-19',
    end_date: '2022-12-20',
    status: EquipmentStatusEnum.STOPPED,
  };

  await app.repositories.equipment.insertOne(newEquipmentItem);

  const response = await app.inject({
    method: 'POST',
    url: `${EQUIPMENT_URL}`,
    payload: newEquipmentItem,
  });

  t.is(response.statusCode, 422);

  const result = response.json();
  t.is(result.message, 'Equipment with code foo4 already exists');
});
