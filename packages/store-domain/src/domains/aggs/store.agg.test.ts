import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { IStoreQuery } from '@hexa/store-domain/ports/out/queries/store.query.ts';
import { IStoreCommand } from '@hexa/store-domain/ports/out/commands/store.command.ts';
import { IStoreAggQuery } from '@hexa/store-domain/ports/out/queries/store-agg.query.ts';
import { PartialExcept, ReadOnlyProperty } from '@hexa/common/types.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { IItemCommand } from '@hexa/store-domain/ports/out/commands/item.command.ts';
import { IItemQuery } from '@hexa/store-domain/ports/out/queries/item.query.ts';
import { IStoreAggCommand } from '@hexa/store-domain/ports/out/commands/store-agg.command.ts';
import { OrderedMap } from 'immutable';

class InMemoryStore implements IStore {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly adminId: string,
  ) {}
}

class InMemoryItem implements IItem {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly storeId: number,
  ) {}
}

interface InMemoryItemQueryExt<T extends IItem> {
  readAllByStoreId(storeId: number): Promise<T[]>,
}

class InMemoryStoreRepo implements IStoreQuery<InMemoryStore>, IStoreCommand<InMemoryStore> {
  private readonly list: Map<number, InMemoryStore>;

  constructor(
    defaultStores: InMemoryStore[] = [],
  ) {
    this.list = new Map<number, InMemoryStore>(defaultStores.map(value => [value.id, value]));
  }

  public async exists(id: number): Promise<boolean> {
    return this.list.has(id);
  }

  public async readById(id: number): Promise<ReadOnlyProperty<InMemoryStore, 'id'> | undefined> {
    return this.list.get(id);
  }

  public async create(store: Omit<InMemoryStore, 'id'>): Promise<InMemoryStore> {
    const existedKeys = Array.from(this.list.keys());
    const generatedKey = existedKeys.length > 0 ? existedKeys[existedKeys.length - 1] : 1;
    const createdStore = new InMemoryStore(
      generatedKey,
      store.name,
      store.description,
      store.adminId,
    );

    this.list.set(generatedKey, createdStore);

    return createdStore;
  }

  public async delete(store: Pick<InMemoryStore, 'id'>): Promise<void> {
    if (!this.list.delete(store.id)) {
      throw new Error('store not found');
    }
  }

  public async update(store: InMemoryStore): Promise<void> {
    const existedStore = this.list.get(store.id);

    if (existedStore == null) {
      throw new Error('store not found');
    }

    this.list.set(existedStore.id, new InMemoryStore(
      existedStore.id,
      store.name,
      store.description,
      store.adminId,
    ));
  }
}

class InMemoryItemRepo implements IItemCommand<InMemoryItem>, IItemQuery<InMemoryItem>,
  InMemoryItemQueryExt<InMemoryItem> {
  private readonly list: Map<number, Map<number, InMemoryItem>>;

  constructor(
    private readonly storeQuery: IStoreQuery<InMemoryStore>,
    defaultItems: [number, InMemoryItem[]][] = [],
  ) {
    this.list = new Map<number, Map<number, InMemoryItem>>(defaultItems.map(value => {
      return [value[0], new Map(value[1].map(value1 => [value1.id, value1]))];
    }));
  }

  public async create(item: Omit<IItem, 'id'>): Promise<IItem> {
    if (!(await this.storeQuery.exists(item.storeId))) {
      throw new Error('store not found');
    }

    const store = this.list.get(item.storeId) ?? new Map<number, InMemoryItem>();
    const existedKeys = Array.from(store.keys());
    const generatedKey = existedKeys.length > 0 ? existedKeys[existedKeys.length - 1] + 1 : 1;
    const createdItem = new InMemoryItem(
      generatedKey,
      item.name,
      item.description,
      item.price,
      item.storeId,
    );

    store.set(generatedKey, createdItem);
    this.list.set(item.storeId, store);

    return createdItem;
  }

  public async delete(item: Pick<InMemoryItem, 'id' | 'storeId'>): Promise<void> {
    const store = this.list.get(item.storeId);
    if (store == null) {
      throw new Error('store not found');
    }

    if (!store.delete(item.id)) {
      throw new Error('item not found');
    }
  }

  public async update(item: PartialExcept<InMemoryItem, 'id' | 'storeId'>): Promise<void> {
    const store = this.list.get(item.storeId);
    if (store == null) {
      throw new Error('store not found');
    }

    const existedItem = store.get(item.id);
    if (existedItem == null) {
      throw new Error('item not found');
    }

    store.set(existedItem.id, new InMemoryItem(
      existedItem.id,
      item.name ?? existedItem.name,
      item.description ?? existedItem.description,
      item.price ?? existedItem.price,
      existedItem.storeId,
    ));
  }

  public async exists(id: number): Promise<boolean> {
    return ([] as InMemoryItem[]).concat(
      ...Array.from(this.list.values()).map(value => Array.from(value.values())),
    ).findIndex(value => value.id === id) > -1;
  }

  public async readById(id: number): Promise<ReadOnlyProperty<InMemoryItem, 'id'> | undefined> {
    return ([] as InMemoryItem[]).concat(
      ...Array.from(this.list.values()).map(value => Array.from(value.values())),
    ).find(value => value.id === id);
  }

  public async readAllByStoreId(storeId: number): Promise<InMemoryItem[]> {
    const store = this.list.get(storeId);

    if (store == null) {
      return [];
    }

    return Array.from(store.values());
  }
}

class InMemoryStoreAggRepo implements IStoreAggQuery<InMemoryStore, InMemoryItem>, IStoreAggCommand<InMemoryItem> {
  constructor(
    private readonly itemQuery: IItemQuery<InMemoryItem> & InMemoryItemQueryExt<InMemoryItem>,
    private readonly storeQuery: IStoreQuery<InMemoryStore>,
    private readonly itemCommand: IItemCommand<InMemoryItem>,
  ) {}

  public async readAggById(id: number): Promise<StoreAgg<InMemoryStore, InMemoryItem> | undefined> {
    const store = await this.storeQuery.readById(id);

    if (store == null) {
      return undefined;
    }

    const items = await this.itemQuery.readAllByStoreId(id);

    return new StoreAgg(
      this,
      store,
      OrderedMap(items.map(item => [item.id, item])),
    );
  }

  public async createItems(items: Omit<InMemoryItem, 'id'>[]): Promise<InMemoryItem[]> {
    return Promise.all(items.map(item => this.itemCommand.create(item)));
  }

  public async deleteItems(items: Pick<InMemoryItem, 'id' | 'storeId'>[]): Promise<void> {
    await Promise.all(items.map(item => this.itemCommand.delete(item)));
  }
}

describe('store-domain aggregate test', () => {
  it('store-domain adding items', async () => {
    const storeRepo = new InMemoryStoreRepo();
    const itemRepo = new InMemoryItemRepo(storeRepo);
    const storeAggRepo = new InMemoryStoreAggRepo(itemRepo, storeRepo, itemRepo);

    const store = await storeRepo.create({
      name: 'test',
      description: 'description',
      adminId: 'adminId',
    });

    await expect(storeRepo.exists(store.id)).resolves.toStrictEqual(true);

    const agg = (await storeAggRepo.readAggById(store.id))!;

    expect(agg).not.toBeUndefined();

    const itemIds = await agg.addItems([
      {
        name: 'item 1',
        description: 'this is item 1',
        price: 10000,
      },
    ]);

    expect(itemIds.length).toStrictEqual(1);
  });

  it('should list items', async () => {
    const storeRepo = new InMemoryStoreRepo([
      {
        id: 1,
        name: 'test 2',
        description: 'description',
        adminId: 'adminId',
      },
    ]);
    const itemRepo = new InMemoryItemRepo(storeRepo, [
      [
        1,
        [
          {
            id: 1,
            name: 'item 1',
            description: 'this is item 1',
            price: 10000,
            storeId: 1,
          },
        ],
      ],
    ]);
    const storeAggRepo = new InMemoryStoreAggRepo(itemRepo, storeRepo, itemRepo);

    const agg = (await storeAggRepo.readAggById(1))!;

    expect(agg.items[0].id).toStrictEqual(1);

    const itemIds = await agg.addItems([
      {
        name: 'item 2',
        description: 'this is item 2',
        price: 5000,
      },
    ]);

    expect(agg.items.length).toStrictEqual(2);
    expect(agg.items[1].id).toStrictEqual(itemIds[0]);
  });

  it('should delete items', async () => {
    const storeRepo = new InMemoryStoreRepo([
      {
        id: 1,
        name: 'test 2',
        description: 'description',
        adminId: 'adminId',
      },
    ]);
    const itemRepo = new InMemoryItemRepo(storeRepo);
    const storeAggRepo = new InMemoryStoreAggRepo(itemRepo, storeRepo, itemRepo);

    const agg = (await storeAggRepo.readAggById(1))!;

    const itemIds = await agg.addItems([
      {
        name: 'item 2',
        description: 'this is item 2',
        price: 5000,
      },
    ]);

    expect(agg.items[0].id).toStrictEqual(1);

    await agg.removeItems([itemIds[0]]);

    expect(agg.items.length).toStrictEqual(0);
  });
});
