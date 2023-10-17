import { EntityManager, EntityManagerType, MikroORM } from '@mikro-orm/core';
import { IDatabaseDriver } from '@mikro-orm/core/drivers';

export class BaseMikroAdapter<D extends IDatabaseDriver = IDatabaseDriver> {
  protected readonly em: D[typeof EntityManagerType] & EntityManager;

  constructor(
    private readonly orm: MikroORM<D>,
    em?: D[typeof EntityManagerType] & EntityManager,
  ) {
    this.em = em ?? this.orm.em;
  }
}
