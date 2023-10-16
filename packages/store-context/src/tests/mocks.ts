import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { Item } from '@hexa/store-context/domains/entities/item.entity';
import { PickType } from '@hexa/common/types';
import { StoreAgg } from '@hexa/store-context/domains/aggs/store.agg';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { IStoreQuery } from '@hexa/store-context/domains/repositories/queries/store.query';
import { IStoreCommand } from '@hexa/store-context/domains/repositories/commands/store.command';
import { IntegerUid } from '@hexa/store-context/domains/vo/integer-uid.vo';

export class InMemoryStoreRepo implements IStoreQuery, IStoreCommand {
  private readonly incrIntFactory = new IncrIntegerFactory();
  private readonly stores: Map<PickType<Store, 'uid'>, StoreAgg>;

  constructor(
    defaultStores: StoreAgg[] = [],
  ) {
    this.stores = new Map<PickType<Store, 'uid'>, StoreAgg>(
      defaultStores.map(agg => [agg.store.uid, agg]),
    );
  }

  public async nextId(): Promise<PickType<Store, 'uid'>> {
    return new IntegerUid(this.incrIntFactory.next());
  }

  public async exists(uid: PickType<Store, 'uid'>): Promise<boolean> {
    return this.stores.has(uid);
  }

  public async readById(uid: PickType<Store, 'uid'>): Promise<StoreAgg | undefined> {
    return this.stores.get(uid);
  }

  public async create(storeAgg: StoreAgg) {
    this.stores.set(storeAgg.store.uid, storeAgg);
  }

  public async delete(storeId: PickType<Store, 'uid'>): Promise<void> {
    const storeAgg = this.stores.get(storeId);
    if (storeAgg == null) {
      throw new Error('store not found');
    }

    this.stores.delete(storeAgg.store.uid);
  }

  public async update(storeAgg: StoreAgg): Promise<void> {
    const existedStoreAgg = this.stores.get(storeAgg.store.uid);
    if (existedStoreAgg == null) {
      throw new Error('store not found');
    }

    this.stores.set(
      existedStoreAgg.store.uid,
      new StoreAgg(
        new Store(storeAgg.store.uid, storeAgg.store.name, storeAgg.store.description, storeAgg.store.adminUid),
        storeAgg.items.map(item => {
          return new Item(item.uid, item.name, item.description, item.price, item.storeUid);
        }),
      ),
    );
  }
}
