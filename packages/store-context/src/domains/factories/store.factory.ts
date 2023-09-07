import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { Item } from '@hexa/store-context/domains/entities/item.entity';
import { StoreAgg } from '@hexa/store-context/domains/aggs/store.agg';
import { IFactory } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { PickType } from '@hexa/common/types';

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

    return new StoreAgg(store, items);
  }
}
