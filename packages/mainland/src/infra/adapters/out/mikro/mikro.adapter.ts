import { EntityManager, EntityManagerType, MikroORM } from '@mikro-orm/core';
import { IDatabaseDriver } from '@mikro-orm/core/drivers';

export class MikroAdapter<D extends IDatabaseDriver = IDatabaseDriver> {
  protected readonly em: D[typeof EntityManagerType] & EntityManager;

  constructor(
    protected readonly orm: MikroORM<D>,
    em?: D[typeof EntityManagerType] & EntityManager,
  ) {
    this.em = em ?? orm.em;
  }
}
