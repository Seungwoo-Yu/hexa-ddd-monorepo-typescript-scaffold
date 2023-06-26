import { InMemoryStoreRepo } from '../../tests/mocks';
import { StoreService } from './store.service';
import { StoreName } from '../vo/store-name.vo';
import { StoreDesc } from '../vo/store-desc.vo';
import { UlidUid } from '../vo/ulid-uid.vo';
import { ItemName } from '../vo/item-name.vo';
import { ItemDesc } from '../vo/item-desc.vo';
import { Price } from '../vo/price.vo';
import { IntegerUid } from '../vo/integer-uid.vo';

describe('store-domain service test', () => {
  it('should create store with items', async () => {
    const repo = new InMemoryStoreRepo();
    const service = new StoreService(repo, repo);

    const storeRaw = {
      name: new StoreName('test'),
      description: new StoreDesc('description'),
      adminUid: UlidUid.create(),
    };
    const itemRawList = [
      {
        name: new ItemName('item 1'),
        description: new ItemDesc('item description 1'),
        price: new Price(10000),
      },
    ];
    const storeAgg = await service.create(storeRaw, itemRawList);

    expect(storeAgg.store.name).toStrictEqual(storeRaw.name);
    expect(storeAgg.items[0].name).toStrictEqual(itemRawList[0].name);
  });

  it('should add items into store', async () => {
    const repo = new InMemoryStoreRepo();
    const service = new StoreService(repo, repo);

    const storeAgg = await service.create({
      name: new StoreName('test'),
      description: new StoreDesc('description'),
      adminUid: UlidUid.create(),
    }, [
      {
        name: new ItemName('item 1'),
        description: new ItemDesc('item description 1'),
        price: new Price(10000),
      },
    ]);
    const itemRawList = [
      {
        name: new ItemName('item 2'),
        description: new ItemDesc('item description 2'),
        price: new Price(15000),
      },
    ];

    await service.addItems(storeAgg, itemRawList);

    expect(storeAgg.items.length).toStrictEqual(2);
    expect(storeAgg.items[1].name).toStrictEqual(itemRawList[0].name);

    const updatedAgg = (await repo.readById(storeAgg.store.uid))!;

    expect(storeAgg.items.length).toStrictEqual(updatedAgg.items.length);
    expect(storeAgg.items[1].name).toStrictEqual(updatedAgg.items[1].name);
  });

  it('should delete items from store', async () => {
    const repo = new InMemoryStoreRepo();
    const service = new StoreService(repo, repo);

    const storeAgg = await service.create({
      name: new StoreName('test 2'),
      description: new StoreDesc('description'),
      adminUid: UlidUid.create(),
    }, [
      {
        name: new ItemName('item 1'),
        description: new ItemDesc('item description 1'),
        price: new Price(10000),
      },
    ]);

    expect(storeAgg.items.length).toStrictEqual(1);

    await service.deleteItems(storeAgg, storeAgg.items.map(item => item.uid));

    expect(storeAgg.items.length).toStrictEqual(0);

    const updatedAgg = (await repo.readById(storeAgg.store.uid))!;

    expect(storeAgg.items.length).toStrictEqual(updatedAgg.items.length);
  });

  it('should throw error after StoreService.deleteItems is called', async () => {
    const repo = new InMemoryStoreRepo();
    const service = new StoreService(repo, repo);

    const storeAgg = await service.create({
      name: new StoreName('test 3'),
      description: new StoreDesc('description'),
      adminUid: UlidUid.create(),
    }, [
      {
        name: new ItemName('item 1'),
        description: new ItemDesc('item description 1'),
        price: new Price(10000),
      },
    ]);

    // This uid doesn't exist so error will be thrown
    await expect(service.deleteItems(storeAgg, [new IntegerUid(9999)]))
      .rejects.toThrowError('item not found');
  });
});
