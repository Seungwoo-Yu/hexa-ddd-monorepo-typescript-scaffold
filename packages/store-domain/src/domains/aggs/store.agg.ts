import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { IStoreAggCommand } from '@hexa/store-domain/ports/out/commands/store-agg.command.ts';
import { PickAndType, PickType } from '@hexa/common/types.ts';
import { OrderedMap } from 'immutable';

export class StoreAgg<T extends IStore, U extends IItem> {
  private itemList: U[];

  constructor(
    private readonly storeAggCommand: IStoreAggCommand<U>,
    public readonly store: T,
    private _items: OrderedMap<PickType<U, 'id'>, U>,
  ) {
    this.itemList = this._items.valueSeq().toArray();
  }
  
  public async addItems(_items: Omit<U, 'id' | 'storeId'>[]) {
    const items = _items.map(item => {
      return {
        name: item.name,
        description: item.description,
        price: item.price,
        storeId: this.store.id,
      } as Omit<U, 'id'>;
    });
    const createdItems = await this.storeAggCommand.createItems(items);

    createdItems.forEach(item => {
      this._items = this._items.set(item.id, item);
    });
    this.itemList = this._items.valueSeq().toArray();

    return createdItems;
  }
  
  public async removeItems(ids: PickAndType<U, 'id'>[]) {
    await this.storeAggCommand.deleteItems(ids);
    this._items = this._items.removeIn(ids);
    this.itemList = this._items.valueSeq().toArray();
  }

  public get items(): readonly U[] {
    return this.itemList;
  }
}
