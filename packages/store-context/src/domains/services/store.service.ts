import { IStoreCommand } from '@hexa/store-context/domains/repositories/commands/store.command';
import { IStoreQuery } from '@hexa/store-context/domains/repositories/queries/store.query';
import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { Item } from '../entities/item.entity';
import { OmitFuncs } from '@hexa/common/types';
import { StoreAgg } from '@hexa/store-context/domains/aggs/store.agg';

export class StoreService {
  constructor(
    private readonly storeQuery: IStoreQuery,
    private readonly storeCommand: IStoreCommand,
  ) {
  }

  public async create(
    _store: Omit<OmitFuncs<Store>, 'uid'>,
    items: Omit<OmitFuncs<Item>, 'uid' | 'storeUid'>[] = [],
  ) {
    const nextId = await this.storeQuery.nextId();
    const storeAgg = new StoreAgg(
      new Store(nextId, _store.name, _store.description, _store.adminUid),
      items.map(item => ({
        name: item.name,
        description: item.description,
        price: item.price,
        storeUid: nextId,
      })),
    );

    await this.storeCommand.create(storeAgg);

    return storeAgg;
  }
}
