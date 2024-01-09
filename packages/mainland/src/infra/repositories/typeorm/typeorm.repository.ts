import { EntityManager } from 'typeorm';

export class TypeormRepository {
  constructor(
    protected readonly em: EntityManager,
  ) {}
}
