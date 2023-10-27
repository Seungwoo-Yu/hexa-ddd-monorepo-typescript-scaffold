import express from 'express';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { CreateUserInAdapter } from '@hexa/mainland/infra/adapters/in/express/create-user-in.adapter';
import { CreateUserScopeAdapter } from '@hexa/mainland/infra/adapters/out/mikro/create-user.scope.adapter';

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

  new CreateUserInAdapter(app, await CreateUserScopeAdapter.start(mikroOrm));

  app.listen(12357);
})();
