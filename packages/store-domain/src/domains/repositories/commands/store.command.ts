import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Item } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { OmitFuncs, PickType } from '@hexa/common/types.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';

export interface IStoreCommand {
  createStore(store: Omit<OmitFuncs<Store>, 'uid'>): Promise<PickType<Store, 'uid'>>,
  updateStore(storeAgg: StoreAgg): Promise<void>,
  deleteStore(storeId: PickType<Store, 'uid'>): Promise<void>,
  createItems(items: Omit<OmitFuncs<Item>, 'uid'>[]): Promise<PickType<Item, 'uid'>[]>,
  deleteItems(itemUids: PickType<Item, 'uid'>[]): Promise<void>,
}
