import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';

export interface IStoreAggCommand<T extends IItem> {
  createItems(item: Omit<T, 'id'>[]): Promise<T[]>,
  deleteItems(items: Pick<T, 'id' | 'storeId'>[]): Promise<void>,
}
