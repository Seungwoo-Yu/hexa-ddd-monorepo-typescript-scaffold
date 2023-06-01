import {
  InMemoryItem,
  InMemoryItemRepo,
  InMemoryStore,
  InMemoryStoreAggRepo,
  InMemoryStoreRepo,
} from '@hexa/store-domain/tests/mocks.ts';
import { StoreFactory } from '@hexa/store-domain/domains/factories/store.factory.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';

describe('store-domain factory test', () => {
  it('should be generated', async () => {
    const storeRepo = new InMemoryStoreRepo();
    const itemRepo = new InMemoryItemRepo(storeRepo);
    const storeAggRepo = new InMemoryStoreAggRepo(itemRepo, storeRepo, itemRepo);

    const agg = await StoreFactory.create(
      storeRepo,
      storeAggRepo,
      new InMemoryStore(1, 'name', 'description', 'adminId'),
      [],
    );

    expect(agg).toBeInstanceOf(StoreAgg);
  });

  it('should be generated with items', async () => {
    const storeRepo = new InMemoryStoreRepo();
    const itemRepo = new InMemoryItemRepo(storeRepo);
    const storeAggRepo = new InMemoryStoreAggRepo(itemRepo, storeRepo, itemRepo);

    const agg = await StoreFactory.create(
      storeRepo,
      storeAggRepo,
      new InMemoryStore(1, 'name', 'description', 'adminId'),
      [
        new InMemoryItem(1, 'item 1', 'description', 1000, 1),
        new InMemoryItem(2, 'item 2', 'description', 2000, 1),
      ],
    );

    expect(agg).toBeInstanceOf(StoreAgg);
    expect(agg.items.length).toStrictEqual(2);
  });
});
