import { EntityManager as TypeEM } from 'typeorm';
import { EntityManager as MikroEM } from '@mikro-orm/core';

export class GlobalRepositoryManager {
  constructor(
    protected readonly typeormEM: TypeEM,
    protected readonly mikroEM: MikroEM,
  ) {}
}
