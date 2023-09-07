import { StoreFactory, StoreIdNotMatchedError } from '@hexa/store-context/domains/factories/store.factory';
import { StoreAgg } from '@hexa/store-context/domains/aggs/store.agg';
import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { IntegerUid } from '@hexa/store-context/domains/vo/integer-uid.vo';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { StoreName } from '@hexa/store-context/domains/vo/store-name.vo';
import { StoreDesc } from '@hexa/store-context/domains/vo/store-desc.vo';
import { UlidUid } from '@hexa/store-context/domains/vo/ulid-uid.vo';
import { Item } from '@hexa/store-context/domains/entities/item.entity';
import { ItemName } from '@hexa/store-context/domains/vo/item-name.vo';
import { ItemDesc } from '@hexa/store-context/domains/vo/item-desc.vo';
import { Price } from '@hexa/store-context/domains/vo/price.vo';

describe('store-domain factory test', () => {
  it('should be generated', async () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const store = new Store(
      new IntegerUid(incrIntegerFactory.next()),
      new StoreName('name'),
      new StoreDesc('description'),
      UlidUid.create(),
    );

    const storeAgg = await StoreFactory.create(store, []);

    expect(storeAgg).toBeInstanceOf(StoreAgg);
    expect(storeAgg.store.uid.uid).toStrictEqual(store.uid.uid);
  });

  it('should be generated with items', async () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const store = new Store(
      new IntegerUid(incrIntegerFactory.next()),
      new StoreName('name 2'),
      new StoreDesc('description 2'),
      UlidUid.create(),
    );
    const items = [
      new Item(
        new IntegerUid(incrIntegerFactory.next()),
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        store.uid,
      ),
      new Item(
        new IntegerUid(incrIntegerFactory.next()),
        new ItemName('item 2'),
        new ItemDesc('this is item 2'),
        new Price(15000),
        store.uid,
      ),
    ];

    const storeAgg = await StoreFactory.create(
      store,
      items,
    );

    expect(storeAgg).toBeInstanceOf(StoreAgg);
    expect(storeAgg.items.length).toStrictEqual(2);
    expect(storeAgg.items[0].name.name).toStrictEqual(items[0].name.name);
    expect(storeAgg.items[1].name.name).toStrictEqual(items[1].name.name);
  });

  it('should not be generated with items ' +
    'because some of them do not have matched store id with store', async () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const store = new Store(
      new IntegerUid(incrIntegerFactory.next()),
      new StoreName('name 2'),
      new StoreDesc('description 2'),
      UlidUid.create(),
    );
    const items = [
      new Item(
        new IntegerUid(incrIntegerFactory.next()),
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        store.uid,
      ),
      new Item(
        new IntegerUid(incrIntegerFactory.next()),
        new ItemName('item 2'),
        new ItemDesc('this is item 2'),
        new Price(15000),
        new IntegerUid(9999), // This does not exist and will cause error
      ),
    ];

    await expect(() => StoreFactory.create(store, items))
      .toThrowError(new StoreIdNotMatchedError(store.uid, items[1].uid, items[1].storeUid));
  });
});
