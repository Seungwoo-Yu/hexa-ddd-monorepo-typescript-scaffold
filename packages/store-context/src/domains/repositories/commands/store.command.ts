import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { PickType } from '@hexa/common/types';
import { StoreAgg } from '@hexa/store-context/domains/aggs/store.agg';

export interface IStoreCommand {
  create(storeAgg: StoreAgg): Promise<void>,
  update(storeAgg: StoreAgg): Promise<void>,
  delete(storeId: PickType<Store, 'uid'>): Promise<void>,
}
