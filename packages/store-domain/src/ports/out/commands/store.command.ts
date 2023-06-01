import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { PartialExcept, PickAndType } from '@hexa/common/types.ts';

export interface IStoreCommand<T extends IStore> {
  create(store: Omit<T, 'id'>): Promise<T>,
  update(store: PartialExcept<T, 'id' | 'adminId'>): Promise<void>,
  delete(storeId: PickAndType<T, 'id'>): Promise<void>,
}
