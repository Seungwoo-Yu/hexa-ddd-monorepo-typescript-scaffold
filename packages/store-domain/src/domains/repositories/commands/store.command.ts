import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Item } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { OmitFuncs, PickAndType } from '@hexa/common/types.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';

export interface IStoreCommand {
  createStore(store: Omit<OmitFuncs<Store>, 'uid'>): Promise<PickAndType<Store, 'uid'>>,
  updateStore(storeAgg: StoreAgg): Promise<void>,
  deleteStore(storeId: PickAndType<Store, 'uid'>): Promise<void>,
  createItems(items: Omit<OmitFuncs<Item>, 'uid'>[]): Promise<PickAndType<Item, 'uid'>[]>,
  deleteItems(itemUids: PickAndType<Item, 'uid'>[]): Promise<void>,
}
