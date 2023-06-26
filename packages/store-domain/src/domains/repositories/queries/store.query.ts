import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { PickAndType } from '@hexa/common/types.ts';
import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';

export interface IStoreQuery {
  readById(id: PickAndType<Store, 'uid'>): Promise<StoreAgg | undefined>,
  exists(id: PickAndType<Store, 'uid'>): Promise<boolean>,
}
