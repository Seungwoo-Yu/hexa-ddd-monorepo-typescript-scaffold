import { PickAndType } from '@hexa/common/types.ts';
import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';

export interface IItem {
  id: number,
  name: string,
  description: string,
  price: number,
  storeId: PickAndType<IStore, 'id'>,
}
