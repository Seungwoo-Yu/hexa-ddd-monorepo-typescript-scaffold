import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Item } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { OmitFuncs, PickType } from '@hexa/common/types.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { IncrIntegerFactory } from '@hexa/common/utils.ts';
import { IStoreQuery } from '@hexa/store-domain/domains/repositories/queries/store.query.ts';
import { IStoreCommand } from '@hexa/store-domain/domains/repositories/commands/store.command.ts';
import { StoreFactory } from '@hexa/store-domain/domains/factories/store.factory.ts';
import { IntegerUid } from '@hexa/store-domain/domains/vo/integer-uid.vo.ts';

export class InMemoryStoreRepo implements IStoreQuery, IStoreCommand {
  private readonly incrIntFactory = new IncrIntegerFactory();
  private readonly stores: Map<PickType<Store, 'uid'>, StoreAgg>;
  private readonly itemIdxToAggIdx: Map<PickType<Item, 'uid'>, [PickType<Store, 'uid'>, number]>;

  constructor(
    defaultStores: StoreAgg[] = [],
  ) {
    this.stores = new Map<PickType<Store, 'uid'>, StoreAgg>(
      defaultStores.map(agg => [agg.store.uid, agg]),
    );
    this.itemIdxToAggIdx = new Map<PickType<Item, 'uid'>, [PickType<Store, 'uid'>, number]>(
      ([] as [PickType<Item, 'uid'>, [PickType<Store, 'uid'>, number]][]).concat(
        ...defaultStores.map((agg, aggIdx) => {
          return agg.items.map(item => {
            if (agg.store.uid !== item.storeUid) {
              throw new Error('uid of store and storeUid of item are different');
            }

            return [item.uid, [item.storeUid, aggIdx]] as
              [PickType<Item, 'uid'>, [PickType<Store, 'uid'>, number]];
          });
        }),
      ),
    );
  }

  public async exists(uid: PickType<Store, 'uid'>): Promise<boolean> {
    return this.stores.has(uid);
  }

  public async readById(uid: PickType<Store, 'uid'>): Promise<StoreAgg | undefined> {
    return this.stores.get(uid);
  }

  public async createStore(_store: Omit<OmitFuncs<Store>, 'uid'>) {
    const createdStore = new Store(new IntegerUid(this.incrIntFactory.next()), _store.name, _store.description, _store.adminUid);
    const storeAgg = await StoreFactory.create(createdStore, []);

    this.stores.set(createdStore.uid, storeAgg);

    return createdStore.uid;
  }

  public async deleteStore(storeId: PickType<Store, 'uid'>): Promise<void> {
    const storeAgg = this.stores.get(storeId);
    if (storeAgg == null) {
      throw new Error('store not found');
    }

    await this.deleteItems(storeAgg.items.map(item => item.uid));
    this.stores.delete(storeAgg.store.uid);
    storeAgg.items.forEach(item => {
      this.itemIdxToAggIdx.delete(item.uid);
    });
  }

  public async updateStore(storeAgg: StoreAgg): Promise<void> {
    const existedStoreAgg = this.stores.get(storeAgg.store.uid);
    if (existedStoreAgg == null) {
      throw new Error('store not found');
    }

    this.stores.set(
      existedStoreAgg.store.uid,
      StoreFactory.create(
        new Store(storeAgg.store.uid, storeAgg.store.name, storeAgg.store.description, storeAgg.store.adminUid),
        Array.from(storeAgg.items, item => {
          return new Item(item.uid, item.name, item.description, item.price, item.storeUid);
        }),
      ),
    );
    storeAgg.items.forEach((item, index) => {
      if (storeAgg.store.uid !== item.storeUid) {
        throw new Error('uid of store and storeUid of item are different');
      }

      this.itemIdxToAggIdx.set(item.uid, [item.storeUid, index]);
    });
  }

  public async createItems(items: Omit<OmitFuncs<Item>, 'uid'>[]): Promise<PickType<Item, 'uid'>[]> {
    const storeToItemsMap = (await Promise.all(items.map(item => {
      const store = this.stores.get(item.storeUid);

      if (store == null) {
        throw new Error('store not found');
      }

      return new Item(
        new IntegerUid(this.incrIntFactory.next()),
        item.name,
        item.description,
        item.price,
        item.storeUid,
      );
    }))).reduce((pr, cv) => {
      const list = pr.get(cv.storeUid) ?? [];

      list.push(cv);
      pr.set(cv.storeUid, list);

      return pr;
    }, new Map<PickType<Store, 'uid'>, Item[]>());
    const storeToItemsEntries = Array.from(storeToItemsMap.entries());

    storeToItemsEntries.forEach(([storeId, items]) => {
      const storeAgg = this.stores.get(storeId);

      if (storeAgg == null) {
        throw new Error('store not found');
      }

      const prevLen = storeAgg.items.length;

      const generatedStoreAgg = StoreFactory.create(
        new Store(storeAgg.store.uid, storeAgg.store.name, storeAgg.store.description, storeAgg.store.adminUid),
        Array.from(storeAgg.items, item => {
          return new Item(item.uid, item.name, item.description, item.price, item.storeUid);
        }),
      );
      this.stores.set(storeAgg.store.uid, generatedStoreAgg);
      generatedStoreAgg.addItems(items);
      items.forEach((item, index) => {
        if (generatedStoreAgg.store.uid !== item.storeUid) {
          throw new Error('uid of store and storeUid of item are different');
        }

        this.itemIdxToAggIdx.set(item.uid, [item.storeUid, prevLen + index]);
      });
    });

    return ([] as Item[]).concat(...Array.from(storeToItemsMap.values())).map(item => item.uid);
  }

  public async deleteItems(itemUids: PickType<Item, 'uid'>[]): Promise<void> {
    const aggIndices: [PickType<Item, 'uid'>, PickType<Store, 'uid'>, number][] = itemUids.map(uid => {
      const aggIdx = this.itemIdxToAggIdx.get(uid);
      if (aggIdx == null) {
        throw new Error('item not found');
      }

      return [uid, ...aggIdx];
    });
    if (aggIndices.some(aggIdx => {
      const storeAgg = this.stores.get(aggIdx[1]);
      if (storeAgg == null) {
        throw new Error('store not found 1');
      }

      return storeAgg.items[aggIdx[2]].uid !== aggIdx[0];
    })) {
      throw new Error('unexpected uid of item');
    }

    const storeAggs = Array.from(new Set(aggIndices.map(idx => idx[1])))
      .map(idx => {
        const storeAgg = this.stores.get(idx);
        if (storeAgg == null) {
          throw new Error('store not found 2');
        }

        return storeAgg;
      });
    const itemIndicesByStoreIndices = aggIndices.reduce(
      (pr, pv) => {
        const set = pr.get(pv[0]) ?? new Set<number>();
        set.add(pv[2]);
        pr.set(pv[1], set);

        return pr;
      },
      new Map<PickType<Store, 'uid'>, Set<number>>(),
    );

    storeAggs.forEach(agg => {
      const uids = Array.from(itemIndicesByStoreIndices.get(agg.store.uid) ?? [])
        .map(idx => agg.items[idx].uid);
      if (uids.length === 0) {
        return;
      }

      const generatedStoreAgg = StoreFactory.create(
        new Store(agg.store.uid, agg.store.name, agg.store.description, agg.store.adminUid),
        Array.from(agg.items, item => {
          return new Item(item.uid, item.name, item.description, item.price, item.storeUid);
        }),
      );
      this.stores.set(agg.store.uid, generatedStoreAgg);
      generatedStoreAgg.removeItems(uids);
    });
  }
}
