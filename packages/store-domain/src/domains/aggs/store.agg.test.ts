import { InMemoryItemRepo, InMemoryStoreAggRepo, InMemoryStoreRepo } from '@hexa/store-domain/tests/mocks.ts';

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
    expect(agg.store.name).toStrictEqual('test');

    const items = await agg.addItems([
      {
        name: 'item 1',
        description: 'this is item 1',
        price: 10000,
      },
    ]);

    expect(items.length).toStrictEqual(1);
    expect(agg.items?.[0]?.name).toStrictEqual(items[0].name);
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
        {
          id: 1,
          name: 'item 1',
          description: 'this is item 1',
          price: 10000,
          storeId: 1,
        },
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
    expect(agg.items[1]).toStrictEqual(itemIds[0]);
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

    expect(agg.items[0].id).toStrictEqual(itemIds[0].id);

    await agg.removeItems([itemIds[0].id]);

    expect(agg.items.length).toStrictEqual(0);
  });
});
