import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Item } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { OrderedMap } from 'immutable';
import { IFactory } from '@hexa/common/interfaces.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { ReadOnlyProperty } from '@hexa/common/types.ts';

@AssertStaticInterface<IFactory<StoreAgg>>()
export class StoreFactory {
  public static create(
    store: ReadOnlyProperty<Store, 'uid'>,
    items: ReadOnlyProperty<Item, 'uid' | 'storeUid'>[],
  ) {

    return new StoreAgg(
      store,
      OrderedMap(items.map(value => [value.uid, value])),
    );
  }
}
