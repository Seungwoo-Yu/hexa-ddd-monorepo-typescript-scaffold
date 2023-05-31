import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { IStoreAggCommand } from '@hexa/store-domain/ports/out/commands/store-agg.command.ts';
import { StoreFactory } from '@hexa/store-domain/domains/factories/store.factory.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { IStoreCommand } from '../../ports/out/commands/store.command';
import { IStoreQuery } from '../../ports/out/queries/store.query';
import { ReadOnlyProperty } from '@hexa/common/types';

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

class InMemoryStoreCommandRepo implements IStoreQuery<InMemoryStore>, IStoreCommand<InMemoryStore> {
  private readonly list: Map<number, InMemoryStore>;

  constructor(
    defaultStores: InMemoryStore[] = [],
  ) {
    this.list = new Map<number, InMemoryStore>(defaultStores.map(value => [value.id, value]));
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

  public async exists(id: number): Promise<boolean> {
    return this.list.has(id);
  }

  public async readById(id: number): Promise<ReadOnlyProperty<InMemoryStore, 'id'> | undefined> {
    return this.list.get(id);
  }
}

class InMemoryStoreAggCommandRepo implements IStoreAggCommand<InMemoryItem> {
  createItems(_: Omit<InMemoryItem, 'id'>[]): Promise<InMemoryItem[]> {
    return Promise.resolve([]);
  }

  deleteItems(_: Pick<InMemoryItem, 'id' | 'storeId'>[]): Promise<void> {
    return Promise.resolve(undefined);
  }
}

describe('store-domain factory test', () => {
  it('should be generated', async () => {
    const agg = await StoreFactory.create(
      new InMemoryStoreCommandRepo(),
      new InMemoryStoreAggCommandRepo(),
      new InMemoryStore(1, 'name', 'description', 'adminId'),
      [],
    );

    expect(agg).toBeInstanceOf(StoreAgg);
  });

  it('should not be generated due to duplication', async () => {
    const commandRepo = new InMemoryStoreCommandRepo();
    const aggCommandRepo = new InMemoryStoreAggCommandRepo();

    const agg = await StoreFactory.create(
      commandRepo,
      aggCommandRepo,
      new InMemoryStore(1, 'name', 'description', 'adminId'),
      [],
    );

    expect(agg).toBeInstanceOf(StoreAgg);

    await expect(StoreFactory.create(
      commandRepo,
      aggCommandRepo,
      new InMemoryStore(1, 'name', 'description', 'adminId'),
      [],
    )).rejects.toThrowError('');
  });

  it('should be generated with items', async () => {
    const agg = await StoreFactory.create(
      new InMemoryStoreCommandRepo(),
      new InMemoryStoreAggCommandRepo(),
      new InMemoryStore(1, 'name', 'description', 'adminId'),
      [
        new InMemoryItem(1, 'item 1', 'description', 1000, 1),
        new InMemoryItem(2, 'item 2', 'description', 2000, 1),
      ],
    );

    expect(agg).toBeInstanceOf(StoreAgg);
    expect(agg.items.length).toStrictEqual(2);
  });

  it('duplicated items must be replaced by higher index', async () => {
    const agg = await StoreFactory.create(
      new InMemoryStoreCommandRepo(),
      new InMemoryStoreAggCommandRepo(),
      new InMemoryStore(1, 'name', 'description', 'adminId'),
      [
        new InMemoryItem(1, 'replace me', 'description', 1000, 1),
        new InMemoryItem(1, 'replaced', 'description', 2000, 1),
      ],
    );

    expect(agg).toBeInstanceOf(StoreAgg);
    expect(agg.items.length).toStrictEqual(1);
    expect(agg.items[0].name).toStrictEqual('replaced');
  });
});
