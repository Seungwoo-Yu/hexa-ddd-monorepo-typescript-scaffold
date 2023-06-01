import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { IStoreQuery } from '@hexa/store-domain/ports/out/queries/store.query.ts';
import { IStoreCommand } from '@hexa/store-domain/ports/out/commands/store.command.ts';
import { IStoreAggQuery } from '@hexa/store-domain/ports/out/queries/store-agg.query.ts';
import { PartialExcept, PickAndType, ReadOnlyProperty } from '@hexa/common/types.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { IItemCommand } from '@hexa/store-domain/ports/out/commands/item.command.ts';
import { IItemQuery } from '@hexa/store-domain/ports/out/queries/item.query.ts';
import { IStoreAggCommand } from '@hexa/store-domain/ports/out/commands/store-agg.command.ts';
import { OrderedMap } from 'immutable';

export class InMemoryStore implements IStore {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly adminId: string,
  ) {}
}

export class InMemoryItem implements IItem {
  constructor(
    public readonly id: number,
    public readonly name: string,
    public readonly description: string,
    public readonly price: number,
    public readonly storeId: number,
  ) {}
}

export interface InMemoryItemQueryExt<T extends IItem> {
  readAllByStoreId(storeId: number): Promise<T[]>,
}

export class InMemoryStoreRepo implements IStoreQuery<InMemoryStore>, IStoreCommand<InMemoryStore> {
  private readonly stores: Map<number, InMemoryStore>;

  constructor(
    defaultStores: InMemoryStore[] = [],
  ) {
    this.stores = new Map<number, InMemoryStore>(defaultStores.map(value => [value.id, value]));
  }

  public async exists(id: number): Promise<boolean> {
    return this.stores.has(id);
  }

  public async readById(id: number): Promise<ReadOnlyProperty<InMemoryStore, 'id'> | undefined> {
    return this.stores.get(id);
  }

  public async create(store: Omit<InMemoryStore, 'id'>): Promise<InMemoryStore> {
    const existedKeys = Array.from(this.stores.keys());
    const generatedKey = existedKeys.length > 0 ? existedKeys[existedKeys.length - 1] : 1;
    const createdStore = new InMemoryStore(
      generatedKey,
      store.name,
      store.description,
      store.adminId,
    );

    this.stores.set(generatedKey, createdStore);

    return createdStore;
  }

  public async delete(storeId: PickAndType<InMemoryStore, 'id'>): Promise<void> {
    if (!this.stores.delete(storeId)) {
      throw new Error('store not found');
    }
  }

  public async update(store: InMemoryStore): Promise<void> {
    const existedStore = this.stores.get(store.id);

    if (existedStore == null) {
      throw new Error('store not found');
    }

    this.stores.set(existedStore.id, new InMemoryStore(
      existedStore.id,
      store.name,
      store.description,
      store.adminId,
    ));
  }
}

export class InMemoryItemRepo implements IItemCommand<InMemoryItem>, IItemQuery<InMemoryItem>,
  InMemoryItemQueryExt<InMemoryItem> {
  private incrementKey = 0;
  private readonly items: Map<number, InMemoryItem>;

  constructor(
    private readonly storeQuery: IStoreQuery<InMemoryStore>,
    defaultItems: [number, InMemoryItem][] = [],
  ) {
    this.items = new Map<number, InMemoryItem>(defaultItems);
  }

  public async create(item: Omit<IItem, 'id'>): Promise<IItem> {
    if (!(await this.storeQuery.exists(item.storeId))) {
      throw new Error('store not found');
    }

    const generatedKey = this.incrementKey++;
    const createdItem = new InMemoryItem(
      generatedKey,
      item.name,
      item.description,
      item.price,
      item.storeId,
    );

    this.items.set(generatedKey, createdItem);

    return createdItem;
  }

  public async delete(id: PickAndType<InMemoryItem, 'id'>): Promise<void> {
    if (!this.items.delete(id)) {
      throw new Error('item not found');
    }
  }

  public async update(item: PartialExcept<InMemoryItem, 'id' | 'storeId'>): Promise<void> {
    const existedItem = this.items.get(item.id);
    if (existedItem == null) {
      throw new Error('item not found');
    }

    this.items.set(existedItem.id, new InMemoryItem(
      existedItem.id,
      item.name ?? existedItem.name,
      item.description ?? existedItem.description,
      item.price ?? existedItem.price,
      existedItem.storeId,
    ));
  }

  public async exists(id: number): Promise<boolean> {
    return ([] as InMemoryItem[]).concat(...Array.from(this.items.values()))
      .findIndex(value => value.id === id) > -1;
  }

  public async readById(id: number): Promise<ReadOnlyProperty<InMemoryItem, 'id' | 'storeId'> | undefined> {
    return ([] as InMemoryItem[]).concat(...Array.from(this.items.values()))
      .find(value => value.id === id);
  }

  public async readAllByStoreId(storeId: number): Promise<InMemoryItem[]> {
    return Array.from(this.items.values()).filter(item => item.storeId === storeId);
  }
}

export class InMemoryStoreAggRepo implements IStoreAggQuery<InMemoryStore, InMemoryItem>,
  IStoreAggCommand<InMemoryItem> {
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

  public async deleteItems(ids: PickAndType<InMemoryItem, 'id'>[]): Promise<void> {
    await Promise.all(ids.map(item => this.itemCommand.delete(item)));
  }
}
