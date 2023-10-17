import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { register } from '@hexa/mainland/infra/adapters/in/express/user-creator-in.adapter';

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
    entities: ['../../dist/packages/mainland/src/infra/models/**/*.model.js'],
    entitiesTs: ['./src/infra/models/**/*.model.ts'],
  });
  const generator = mikroOrm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();

  app.use(express.json());
  app.use(express.urlencoded());

  register(mikroOrm, app);

  app.listen(12357);
})();
