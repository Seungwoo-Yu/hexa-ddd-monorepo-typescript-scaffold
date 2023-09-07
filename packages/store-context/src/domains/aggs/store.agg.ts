import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { Item } from '@hexa/store-context/domains/entities/item.entity';
import { PickNestedType, PickType } from '@hexa/common/types';
import { OrderedMap } from 'immutable';

export class DuplicatedItemIdError extends Error {
  constructor(
    itemId: PickType<Item, 'uid'>,
  ) {
    super('item id ' + itemId.uid + ' is duplicated');
  }
}

export class StoreAgg {
  public items: Item[] = [];
  private itemIdxMap = OrderedMap<PickNestedType<Item, ['uid', 'uid']>, Item>();

  constructor(
    public readonly store: Store,
    items: Item[],
  ) {
    this.addItems(items);
  }

  public addItems(items: Item[]) {
    items.forEach(item => {
      if (this.itemIdxMap.has(item.uid.uid)) {
        throw new DuplicatedItemIdError(item.uid);
      }

      this.itemIdxMap = this.itemIdxMap.set(item.uid.uid, item);
    });
    this.items.push(...items);
  }

  public removeItems(ids: PickType<Item, 'uid'>[]) {
    this.itemIdxMap = this.itemIdxMap.removeIn(ids);
    this.items = this.items.filter(item => ids.findIndex(id => item.uid.equals(id)) === -1);
  }
}
