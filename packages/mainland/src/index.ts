import 'dotenv/config';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { DataSource } from 'typeorm';
import { loadExpress } from '@hexa/mainland/loaders';
import { mikroModels } from '@hexa/mainland/infra/models/mikro';
import { typeormModels } from '@hexa/mainland/infra/models/typeorm';
import { config } from '@hexa/mainland/config';
import * as http from 'http';

(async () => {
  const mikroOrm = await MikroORM.init({
    host: config.writerDbHost,
    port: config.writerDbPort,
    schema: config.writerDbSchema,
    dbName: config.writerDbName,
    user: config.writerDbUser,
    password: config.writerDbPassword,
    driver: PostgreSqlDriver,
    entities: mikroModels,
  });
  await mikroOrm.connect();

  const typeorm = new DataSource({
    type: 'postgres',
    host: config.readerDbHost,
    port: config.readerDbPort,
    schema: config.readerDbSchema,
    database: config.readerDbName,
    username: config.readerDbUser,
    password: config.readerDbPassword,
    entities: typeormModels,
    synchronize: false,
  });
  await typeorm.initialize();

  if (config.devMode) {
    const generator = mikroOrm.getSchemaGenerator();
    await generator.updateSchema();
  }

  const express = loadExpress(typeorm, mikroOrm);
  const server = http.createServer(express);
  server.listen(config.hostPort);
})();
