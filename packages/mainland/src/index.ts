import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CreateUserInAdapter } from '@hexa/mainland/infra/adapters/in/express/create-user-in.adapter';
import { DataSource } from 'typeorm';
import { isRunningOnTsNode } from '@hexa/mainland/utils';
import { CreateUserRepository } from '@hexa/mainland/infra/adapters/out/create-user.repository';

(async () => {
  const app = express();
  const mikroOrm = await MikroORM.init({
    host: 'localhost',
    port: 25432,
    schema: 'public',
    dbName: 'postgres',
    user: 'postgres',
    password: '1234',
    driver: PostgreSqlDriver,
    entities: ['../../dist/packages/mainland/src/infra/models/mikro/*.model.js'],
    entitiesTs: ['./src/infra/models/mikro/*.model.ts'],
  });
  const typeorm = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 25432,
    schema: 'public',
    database: 'postgres',
    username: 'postgres',
    password: '1234',
    entities: [
      isRunningOnTsNode()
        ? './src/infra/models/typeorm/*.model.ts'
        : '../../dist/packages/mainland/src/infra/models/typeorm/*.model.js',
    ],
  });
  const generator = mikroOrm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();

  app.use(express.json());
  app.use(express.urlencoded());

  new CreateUserInAdapter(app, CreateUserRepository.create(typeorm, mikroOrm));

  app.listen(12357);
})();
