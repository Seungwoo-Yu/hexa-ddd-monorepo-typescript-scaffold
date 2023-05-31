import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';

export interface IStoreCommand<T extends IStore> {
  create(store: Omit<T, 'id'>): Promise<T>,
  update(store: T): Promise<void>,
  delete(item: Pick<T, 'id'>): Promise<void>,
}
