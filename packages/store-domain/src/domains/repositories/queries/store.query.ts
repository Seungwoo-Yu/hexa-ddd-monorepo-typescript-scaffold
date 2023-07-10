import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { PickType } from '@hexa/common/types.ts';
import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';

export interface IStoreQuery {
  readById(id: PickType<Store, 'uid'>): Promise<StoreAgg | undefined>,
  exists(id: PickType<Store, 'uid'>): Promise<boolean>,
}
