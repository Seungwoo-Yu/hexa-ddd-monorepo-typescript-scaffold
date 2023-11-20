import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { DataSource } from 'typeorm';
import { isRunningOnTsNode } from '@hexa/mainland/utils';
import { loadExpress } from '@hexa/mainland/loaders';

(async () => {
  const mikroOrm = await MikroORM.init({
    host: 'localhost',
    port: 25432,
    schema: 'public',
    dbName: 'postgres',
    user: 'postgres',
    password: '1234',
    driver: PostgreSqlDriver,
    entities: ['../../dist/packages/mainland/src/infra/models/mikro/*.model.js'],
    entitiesTs: ['src/infra/models/mikro/*.model.ts'],
  });
  await mikroOrm.connect();

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
        ? 'src/infra/models/typeorm/*.model.ts'
        : '../../dist/packages/mainland/src/infra/models/typeorm/*.model.js',
    ],
    synchronize: false,
  });
  await typeorm.initialize();

  const generator = mikroOrm.getSchemaGenerator();
  await generator.dropSchema();
  await generator.createSchema();

  loadExpress(typeorm, mikroOrm);
})();
