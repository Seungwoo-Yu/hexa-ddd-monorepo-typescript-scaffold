import { TestDockerInfo, useTestDocker } from '@hexa/common/test-utils';
import { initExpress } from '@hexa/mainland/test-utils';
import { DataSource } from 'typeorm';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { type Server } from 'http';
import request from 'supertest';
import TestAgent from 'supertest/lib/agent';

const store: {
  testDockerInfo: TestDockerInfo,
  typeorm: DataSource,
  mikro: MikroORM<PostgreSqlDriver>,
  express: Server,
  agent: TestAgent,
} = {} as {
  testDockerInfo: TestDockerInfo,
  typeorm: DataSource,
  mikro: MikroORM<PostgreSqlDriver>,
  express: Server,
  agent: TestAgent,
};

describe('create user adapter test', () => {
  useTestDocker(store);

  beforeAll(async () => {
    const instances = await initExpress(store.testDockerInfo);
    store.typeorm = instances.typeorm;
    store.mikro = instances.mikro;
    store.express = instances.express;
    store.agent = request(instances.express);
  });

  afterAll(async () => {
    await store.typeorm.destroy();
    await store.mikro.close(true);
    store.express.close();
  });

  it('should create user', async () => {
    const res = await store.agent.post('/v1/user').send({
      id: 'id1234',
      password: 'password1234',
      nickname: 'nickname',
    });

    expect(res.statusCode).toStrictEqual(200);
  });

  it('should not create user because id is not satisfied', async () => {
    const res = await store.agent.post('/v1/user').send({
      password: 'password1234',
      nickname: 'nickname',
    });

    expect(res.statusCode).toStrictEqual(422);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toStrictEqual('Error: id is undefined or null');

    const res2 = await store.agent.post('/v1/user').send({
      id: '',
      password: 'password1234',
      nickname: 'nickname',
    });

    expect(res2.statusCode).toStrictEqual(422);
    expect(res2.body.errors).toHaveLength(1);
    expect(res2.body.errors[0]).toStrictEqual('Error: id must be longer than 1');
  });

  it('should not create user because password is not satisfied', async () => {
    const res = await store.agent.post('/v1/user').send({
      id: 'id12345678',
      nickname: 'nickname',
    });

    expect(res.statusCode).toStrictEqual(422);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toStrictEqual('Error: password is undefined or null');

    const res2 = await store.agent.post('/v1/user').send({
      id: 'id12345678',
      password: '',
      nickname: 'nickname',
    });

    expect(res2.statusCode).toStrictEqual(422);
    expect(res2.body.errors).toHaveLength(1);
    expect(res2.body.errors[0]).toStrictEqual('Error: password must be longer than 1');
  });

  it('should not create user because nickname is not satisfied', async () => {
    const res = await store.agent.post('/v1/user').send({
      id: 'id12345678',
      password: 'password1234',
    });

    expect(res.statusCode).toStrictEqual(422);
    expect(res.body.errors).toHaveLength(1);
    expect(res.body.errors[0]).toStrictEqual('Error: nickname is undefined or null');

    const res2 = await store.agent.post('/v1/user').send({
      id: 'id12345678',
      password: 'password1234',
      nickname: '',
    });

    expect(res2.statusCode).toStrictEqual(422);
    expect(res2.body.errors).toHaveLength(1);
    expect(res2.body.errors[0]).toStrictEqual('Error: nickname must be longer than 5');
  });

  it('should not create user because ids are duplicated', async () => {
    const res = await store.agent.post('/v1/user').send({
      id: 'id12345678',
      password: 'password1234',
      nickname: 'nickname',
    });

    expect(res.statusCode).toStrictEqual(200);

    const res2 = await store.agent.post('/v1/user').send({
      id: 'id12345678',
      password: 'password1234',
      nickname: 'nickname',
    });

    expect(res2.statusCode).toStrictEqual(409);
    expect(res2.body.error).toBeDefined();
    expect(res2.body.error).toStrictEqual('Error: id id12345678 is duplicated');
  });
});
