import express from 'express';
import { DataSource } from 'typeorm';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { createUserAdapter } from '@hexa/mainland/infra/adapters/in/express/create-user.adapter';
import { CreateUserUseCase } from '@hexa/mainland/app/create-user.use-case';
import { CreateUserRepoAdapter } from '@hexa/mainland/app/adapters/out/create-user-repo.adapter';

export function loadExpress(typeorm: DataSource, mikroOrm: MikroORM<PostgreSqlDriver>) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded());

  createUserAdapter(app, new CreateUserUseCase(new CreateUserRepoAdapter(typeorm, mikroOrm)));

  app.listen(12357);

  return app;
}
