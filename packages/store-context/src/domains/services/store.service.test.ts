import { InMemoryStoreRepo } from '@hexa/store-context/tests/mocks';
import { StoreService } from '@hexa/store-context/domains/services/store.service';
import { StoreDesc } from '@hexa/store-context/domains/vo/store-desc.vo';
import { StoreName } from '@hexa/store-context/domains/vo/store-name.vo';
import { UlidUid } from '@hexa/store-context/domains/vo/ulid-uid.vo';
import { ItemName } from '@hexa/store-context/domains/vo/item-name.vo';
import { ItemDesc } from '@hexa/store-context/domains/vo/item-desc.vo';
import { Price } from '@hexa/store-context/domains/vo/price.vo';

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
});
