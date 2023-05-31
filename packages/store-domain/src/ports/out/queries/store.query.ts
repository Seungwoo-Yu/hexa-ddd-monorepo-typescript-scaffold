import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { ReadOnlyProperty } from '@hexa/common/types.ts';

export interface IStoreQuery<T extends IStore> {
  readById(id: number): Promise<ReadOnlyProperty<T, 'id'> | undefined>,
  exists(id: number): Promise<boolean>,
}
