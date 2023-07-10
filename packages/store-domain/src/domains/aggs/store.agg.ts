import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Item } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { PickType, ReadOnlyProperty } from '@hexa/common/types.ts';
import { OrderedMap } from 'immutable';

export class StoreAgg {
  private itemList: Item[];

  constructor(
    public readonly store: ReadOnlyProperty<Store, 'uid'>,
    private _items: OrderedMap<PickType<Item, 'uid'>, Item>,
  ) {
    this.itemList = this._items.valueSeq().toArray();
  }

  public addItems(
    items: Exclude<Item, 'storeUid' | 'uid'>[],
  ): ReadOnlyProperty<Item, 'storeUid' | 'uid'>[] {
    items.forEach(item => {
      this._items = this._items.set(item.uid, item);
    });
    this.itemList = this._items.valueSeq().toArray();

    return items;
  }

  public removeItems(ids: PickType<Item, 'uid'>[]) {
    this._items = this._items.removeIn(ids);
    this.itemList = this._items.valueSeq().toArray();
  }

  public get items(): ReadOnlyProperty<Item, 'storeUid' | 'uid'>[] {
    return this.itemList;
  }
}
