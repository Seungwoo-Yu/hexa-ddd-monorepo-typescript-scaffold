import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';

export interface IStoreAggQuery<T extends IStore, U extends IItem> {
  readAggById(id: number): Promise<StoreAgg<T, U> | undefined>,
}
