import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { ReadOnlyProperty } from '@hexa/common/types.ts';

export interface IItemQuery<T extends IItem> {
  readById(id: number): Promise<ReadOnlyProperty<T, 'id' | 'storeId'> | undefined>,
  exists(id: number): Promise<boolean>,
}
