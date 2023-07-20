import { IStoreCommand } from '@hexa/store-domain/domains/repositories/commands/store.command';
import { IStoreQuery } from '@hexa/store-domain/domains/repositories/queries/store.query';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg';
import { Store } from '@hexa/store-domain/domains/entities/store.entity';
import { Item } from '../entities/item.entity';
import { StoreFactory } from '../factories/store.factory';
import { OmitFuncs, PickType } from '@hexa/common/types';

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

  public async deleteItems(storeAgg: StoreAgg, itemIds: PickType<Item, 'uid'>[]) {
    await this.storeCommand.deleteItems(itemIds);
    storeAgg.removeItems(itemIds);
  }
}
