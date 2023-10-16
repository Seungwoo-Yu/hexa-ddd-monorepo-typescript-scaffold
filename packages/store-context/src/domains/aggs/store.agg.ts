import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { Item } from '@hexa/store-context/domains/entities/item.entity';
import { OmitFuncs, PickNestedType, PickType } from '@hexa/common/types';
import { OrderedMap } from 'immutable';
import { IntegerUid } from '@hexa/store-context/domains/vo/integer-uid.vo';

export class StoreIdNotMatchedError extends Error {
  constructor(
    storeId: PickType<Item, 'uid'>,
    invalidStoreId: PickType<Item, 'uid'>,
  ) {
    super(`store ${invalidStoreId.uid} found in item is not matched with store ${storeId.uid} while inserting`);
  }
}

export class StoreAgg {
  public items: Item[] = [];
  private itemIdxMap = OrderedMap<PickNestedType<Item, ['uid', 'uid']>, Item>();

  constructor(
    public readonly store: Store,
    items: Omit<OmitFuncs<Item>, 'uid'>[] = [],
  ) {
    this.addItems(items);
  }

  public addItems(_items: Omit<OmitFuncs<Item>, 'uid'>[]) {
    _items.forEach(item => {
      if (!this.store.uid.equals(item.storeUid)) {
        throw new StoreIdNotMatchedError(this.store.uid, item.storeUid);
      }
    });

    const items = _items.map(_item => {
      const prevId = this.items.length === 0 ? 0 : this.items[this.items.length - 1].uid.uid;
      const item = new Item(
        new IntegerUid(prevId + 1),
        _item.name,
        _item.description,
        _item.price,
        _item.storeUid,
      );

      this.itemIdxMap = this.itemIdxMap.set(item.uid.uid, item);

      return item;
    });

    this.items.push(...items);
  }

  public removeItems(ids: PickType<Item, 'uid'>[]) {
    this.itemIdxMap = this.itemIdxMap.removeIn(ids);
    this.items = this.items.filter(item => ids.findIndex(id => item.uid.equals(id)) === -1);
  }
}
