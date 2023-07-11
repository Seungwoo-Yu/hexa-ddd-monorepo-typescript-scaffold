import { StoreName } from '@hexa/store-domain/domains/vo/store-name.vo.ts';
import { StoreDesc } from '@hexa/store-domain/domains/vo/store-desc.vo.ts';
import { UlidUid } from '@hexa/store-domain/domains/vo/ulid-uid.vo.ts';
import { ItemName } from '@hexa/store-domain/domains/vo/item-name.vo.ts';
import { ItemDesc } from '@hexa/store-domain/domains/vo/item-desc.vo.ts';
import { Price } from '@hexa/store-domain/domains/vo/price.vo.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { IncrIntegerFactory } from '@hexa/common/utils.ts';
import { IntegerUid } from '@hexa/store-domain/domains/vo/integer-uid.vo.ts';
import { Item } from '@hexa/store-domain/domains/entities/item.entity.ts';

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
        new IntegerUid(incrIntegerFactory.next()),
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
        new IntegerUid(incrIntegerFactory.next()),
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
        new IntegerUid(incrIntegerFactory.next()),
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

  it('should not create aggregate because there are one or more duplicated item ids', function () {
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
        new IntegerUid(1),
        new ItemName('item 1'),
        new ItemDesc('this is item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
      new Item(
        new IntegerUid(1),
        new ItemName('duplicated item 1'),
        new ItemDesc('this is duplicated item 1'),
        new Price(10000),
        storeAgg.store.uid,
      ),
    ];

    expect(() => storeAgg.addItems(items)).toThrowError('item id 1 is duplicated');
  });
});
