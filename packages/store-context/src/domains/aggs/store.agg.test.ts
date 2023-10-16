import { StoreName } from '@hexa/store-context/domains/vo/store-name.vo';
import { StoreDesc } from '@hexa/store-context/domains/vo/store-desc.vo';
import { UlidUid } from '@hexa/store-context/domains/vo/ulid-uid.vo';
import { ItemName } from '@hexa/store-context/domains/vo/item-name.vo';
import { ItemDesc } from '@hexa/store-context/domains/vo/item-desc.vo';
import { Price } from '@hexa/store-context/domains/vo/price.vo';
import { StoreAgg, StoreIdNotMatchedError } from '@hexa/store-context/domains/aggs/store.agg';
import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { IntegerUid } from '@hexa/store-context/domains/vo/integer-uid.vo';
import { Item } from '@hexa/store-context/domains/entities/item.entity';

describe('store-domain aggregate test', () => {
  it('should add items', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const storeAgg = new StoreAgg(
      new Store(
        new IntegerUid(incrIntegerFactory.next()),
        new StoreName('test'),
        new StoreDesc('description'),
        UlidUid.create(),
      ),
      [],
    );

    expect(storeAgg).not.toBeUndefined();
    expect(storeAgg.store.name.name).toStrictEqual(storeAgg.store.name.name);
    expect(storeAgg.store.description.desc).toStrictEqual(storeAgg.store.description.desc);
    expect(storeAgg.store.adminUid.uid).toStrictEqual(storeAgg.store.adminUid.uid);

    const items = [
      new Item(
        new IntegerUid(incrIntegerFactory.next()), // Discarded
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
    ];

    storeAgg.addItems(items);

    expect(storeAgg.items.length).toStrictEqual(1);
    expect(storeAgg.items[0].name).toStrictEqual(items[0].name);
  });

  it('should delete items', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const storeAgg = new StoreAgg(
      new Store(
        new IntegerUid(incrIntegerFactory.next()),
        new StoreName('test 2'),
        new StoreDesc('description'),
        UlidUid.create(),
      ),
      [],
    );

    const items = [
      new Item(
        new IntegerUid(incrIntegerFactory.next()), // Discarded
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
    ];
    storeAgg.addItems(items);

    storeAgg.removeItems(items.map(item => item.uid));

    expect(storeAgg.items.length).toStrictEqual(0);
  });

  it('should do nothing after StoreAgg.removeItems is called', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const storeAgg = new StoreAgg(
      new Store(
        new IntegerUid(incrIntegerFactory.next()),
        new StoreName('test 3'),
        new StoreDesc('description'),
        UlidUid.create(),
      ),
      [],
    );

    const items = [
      new Item(
        new IntegerUid(incrIntegerFactory.next()), // Discarded
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
    ];
    storeAgg.addItems(items);

    storeAgg.removeItems([new IntegerUid(9999)]); // This uid doesn't exist so nothing is changed

    expect(storeAgg.items.length).toStrictEqual(1);
    expect(storeAgg.items[0].name).toStrictEqual(items[0].name);
  });

  it('should create aggregate because pre-inserted id of items are ignored', function () {
    const storeAgg = new StoreAgg(
      new Store(
        new IntegerUid(0),
        new StoreName('test 3'),
        new StoreDesc('description'),
        UlidUid.create(),
      ),
      [],
    );

    const items = [
      new Item(
        new IntegerUid(1), // Discarded
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
      new Item(
        new IntegerUid(1), // Discarded
        new ItemName('duplicated item 1'),
        new ItemDesc('this is duplicated item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
    ];

    storeAgg.addItems(items);
  });

  it('should not add items ' +
    'because some of them do not have matched store id with store', async () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const storeAgg = new StoreAgg(
      new Store(
        new IntegerUid(0),
        new StoreName('test 4'),
        new StoreDesc('description'),
        UlidUid.create(),
      ),
      [],
    );

    const items = [
      new Item(
        new IntegerUid(incrIntegerFactory.next()), // Discarded
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
      new Item(
        new IntegerUid(incrIntegerFactory.next()), // Discarded
        new ItemName('item 2'),
        new ItemDesc('this is item 2'),
        new Price(15000),
        new IntegerUid(9999), // This will cause error
      ),
    ];

    expect(() => storeAgg.addItems(items))
      .toThrowError(new StoreIdNotMatchedError(storeAgg.store.uid, items[1].storeUid));
  });
});
