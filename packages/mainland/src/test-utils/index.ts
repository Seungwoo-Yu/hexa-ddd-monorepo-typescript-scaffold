import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { randomPort, TestDockerInfo } from '@hexa/common/test-utils';
import { mikroModels } from '@hexa/mainland/infra/models/mikro';
import { DataSource } from 'typeorm';
import { typeormModels } from '@hexa/mainland/infra/models/typeorm';
import { loadExpress } from '@hexa/mainland/loaders';
import * as http from 'http';

export async function initMikro(testDockerInfo: TestDockerInfo, skipSync = false) {
  const mikroOrm = await MikroORM.init({
    host: 'localhost',
    port: testDockerInfo.port,
    schema: testDockerInfo.schemaName,
    dbName: testDockerInfo.databaseName,
    user: testDockerInfo.userName,
    password: testDockerInfo.password,
    driver: PostgreSqlDriver,
    entities: mikroModels,
    pool: {
      min: 0,
      idleTimeoutMillis: 1,
    },
  });
  await mikroOrm.connect();

  if (!skipSync) {
    const generator = mikroOrm.getSchemaGenerator();
    await generator.dropSchema();
    await generator.createSchema();
  }

  return mikroOrm;
}

export async function initTypeORM(testDockerInfo: TestDockerInfo, skipSync = false) {
  const typeorm = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: testDockerInfo.port,
    schema: testDockerInfo.schemaName,
    database: testDockerInfo.databaseName,
    username: testDockerInfo.userName,
    password: testDockerInfo.password,
    entities: typeormModels,
    synchronize: !skipSync,
  });
  await typeorm.initialize();

  return typeorm;
}

export async function initExpress(testDockerInfo: TestDockerInfo, skipSync = false) {
  const mikro = await initMikro(testDockerInfo, skipSync);
  const typeorm = await initTypeORM(testDockerInfo, skipSync);
  const port = await randomPort();
  const express = loadExpress(typeorm, mikro);
  const server = http.createServer(express);
  server.listen(port);

  return {
    typeorm,
    mikro,
    express: server,
  };
}
