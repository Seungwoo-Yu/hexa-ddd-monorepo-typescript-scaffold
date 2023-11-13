import { IDatabaseDriver } from '@mikro-orm/core/drivers';
import { EntityManager, EntityManagerType } from '@mikro-orm/core';

export class MikroRepository<D extends IDatabaseDriver = IDatabaseDriver> {
  constructor(
    protected readonly em: D[typeof EntityManagerType] & EntityManager,
  ) {}
}
