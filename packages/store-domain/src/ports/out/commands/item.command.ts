import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { PartialExcept, PickAndType } from '@hexa/common/types.ts';

export interface IItemCommand<T extends IItem> {
  create(item: Omit<T, 'id'>): Promise<T>,
  update(item: Omit<PartialExcept<T, 'id'>, 'storeId'>): Promise<void>,
  delete(item: PickAndType<T, 'id'>): Promise<void>,
}
