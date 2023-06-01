import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { PickAndType, ReadOnlyProperty } from '@hexa/common/types.ts';

export interface IStoreAggCommand<T extends IItem> {
  createItems(items: Omit<T, 'id'>[]): Promise<ReadOnlyProperty<T, 'id' | 'storeId'>[]>,
  deleteItems(ids: PickAndType<T, 'id'>[]): Promise<void>,
}
