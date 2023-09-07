import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { Item } from '@hexa/store-context/domains/entities/item.entity';
import { OmitFuncs, PickType } from '@hexa/common/types';
import { StoreAgg } from '@hexa/store-context/domains/aggs/store.agg';

export interface IStoreCommand {
  createStore(store: Omit<OmitFuncs<Store>, 'uid'>): Promise<PickType<Store, 'uid'>>,
  updateStore(storeAgg: StoreAgg): Promise<void>,
  deleteStore(storeId: PickType<Store, 'uid'>): Promise<void>,
  createItems(items: Omit<OmitFuncs<Item>, 'uid'>[]): Promise<PickType<Item, 'uid'>[]>,
  deleteItems(itemUids: PickType<Item, 'uid'>[]): Promise<void>,
}
