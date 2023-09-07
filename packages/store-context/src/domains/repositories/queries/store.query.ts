import { StoreAgg } from '@hexa/store-context/domains/aggs/store.agg';
import { PickType } from '@hexa/common/types';
import { Store } from '@hexa/store-context/domains/entities/store.entity';

export interface IStoreQuery {
  readById(id: PickType<Store, 'uid'>): Promise<StoreAgg | undefined>,
  exists(id: PickType<Store, 'uid'>): Promise<boolean>,
}
