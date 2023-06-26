import { IStoreCommand } from '@hexa/store-domain/domains/repositories/commands/store.command.ts';
import { IStoreQuery } from '@hexa/store-domain/domains/repositories/queries/store.query.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Item } from '../entities/item.entity';
import { StoreFactory } from '../factories/store.factory';
import { OmitFuncs, PickAndType } from '@hexa/common/types.ts';

export class StoreService {
  constructor(
    private readonly storeCommand: IStoreCommand,
    private readonly storeQuery: IStoreQuery,
  ) {
  }

  public async create(
    _store: Omit<OmitFuncs<Store>, 'uid'>,
    _items: Omit<OmitFuncs<Item>, 'uid' | 'storeUid'>[] = [],
  ) {
    const storeUid = await this.storeCommand.createStore(_store);
    const itemUids = await this.storeCommand.createItems(_items.map(item => {
      return {
        name: item.name,
        description: item.description,
        price: item.price,
        storeUid,
      };
    }));
    const store = new Store(storeUid, _store.name, _store.description, _store.adminUid);
    const items = _items.map((item, index) => {
      return new Item(itemUids[index], item.name, item.description, item.price, storeUid);
    });

    return StoreFactory.create(store, items);
  }

  public async addItems(storeAgg: StoreAgg, _items: Omit<OmitFuncs<Item>, 'uid' | 'storeUid'>[]) {
    const itemUids = await this.storeCommand.createItems(_items.map(item => {
      return {
        name: item.name,
        description: item.description,
        price: item.price,
        storeUid: storeAgg.store.uid,
      };
    }));
    const items = _items.map((item, index) => {
      return new Item(itemUids[index], item.name, item.description, item.price, storeAgg.store.uid);
    });

    storeAgg.addItems(items);
  }

  public async deleteItems(storeAgg: StoreAgg, itemIds: PickAndType<Item, 'uid'>[]) {
    await this.storeCommand.deleteItems(itemIds);
    storeAgg.removeItems(itemIds);
  }
}
