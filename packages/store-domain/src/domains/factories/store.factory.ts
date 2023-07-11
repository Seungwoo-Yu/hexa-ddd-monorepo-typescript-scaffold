import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Item } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { OrderedMap } from 'immutable';
import { IFactory } from '@hexa/common/interfaces.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { PickType } from '@hexa/common/types.ts';

export class StoreIdNotMatchedError extends Error {
  constructor(
    storeId: PickType<Item, 'uid'>,
    itemId: PickType<Item, 'uid'>,
    invalidStoreId: PickType<Item, 'uid'>,
  ) {
    super('store ' + invalidStoreId.uid + ' found in item ' + itemId.uid + ' is not matched with store ' + storeId.uid);
  }
}

@AssertStaticInterface<IFactory<StoreAgg>>()
export class StoreFactory {
  public static create(store: Store, items: Item[]) {
    items.forEach(item => {
      if (!store.uid.equals(item.storeUid)) {
        throw new StoreIdNotMatchedError(store.uid, item.uid, item.storeUid);
      }
    });

    return new StoreAgg(
      store,
      OrderedMap(items.map(value => [value.uid, value])),
    );
  }
}
