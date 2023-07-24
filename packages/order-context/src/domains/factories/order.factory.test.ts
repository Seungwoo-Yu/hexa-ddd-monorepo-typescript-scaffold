import {
  DuplicatedStoitUidError, DuplicatedStoreUidError,
  NoOrderLineError,
  NoOrderStoitError,
  NoOrderStoreError,
  OrderFactory, OrderUidNotMatchedError,
} from '@hexa/order-context/domains/factories/order.factory';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { UlidUid } from '@hexa/order-context/domains/vo/ulid-uid.vo';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { PriceDetail } from '@hexa/order-context/domains/vo/price-detail.vo';

describe('order-context order factory test', () => {
  it('should create successfully', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'store',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'store item',
      'description',
      store.uid,
    );
    const orderLines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        store.uid,
        stoit.uid,
        new PriceDetail(10000),
      ),
    ];
    const orderAgg = OrderFactory.create(order, orderLines, [stoit], [store]);

    expect(orderAgg.order.uid.uid).toStrictEqual(order.uid.uid);
    expect(orderAgg.lines.length).toStrictEqual(1);
    expect(orderAgg.lines[0].uid.uid).toStrictEqual(orderLines[0].uid.uid);
    expect(orderAgg.stores.length).toStrictEqual(1);
    expect(orderAgg.stores[0].uid.uid).toStrictEqual(store.uid.uid);
    expect(orderAgg.stoits.length).toStrictEqual(1);
    expect(orderAgg.stoits[0].uid.uid).toStrictEqual(stoit.uid.uid);
  });

  it('should not create because there are no order lines', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'store 2',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'store item 2',
      'description 2',
      store.uid,
    );

    expect(() => OrderFactory.create(order, [], [stoit], [store])) // This will occur error
      .toThrowError(new NoOrderLineError(order.uid));
  });

  it('should not create because there are no stoits', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'store 3',
      UlidUid.create(),
    );
    const orderLines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        store.uid,
        new IntegerUid(incrIntegerFactory.next()), // This will occur error
        new PriceDetail(10000),
      ),
    ];

    expect(() => OrderFactory.create(order, orderLines, [], [store]))
      .toThrowError(new NoOrderStoitError(order.uid));
  });

  it('should not create because there are no stores', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'store item 4',
      'description 4',
      new IntegerUid(incrIntegerFactory.next()), // This will occur error
    );
    const orderLines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        stoit.storeUid,
        stoit.uid,
        new PriceDetail(10000),
      ),
    ];

    expect(() => OrderFactory.create(order, orderLines, [stoit], []))
      .toThrowError(new NoOrderStoreError(order.uid));
  });

  it('should not create because order uids are not matched', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'store 5',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'store item 5',
      'description 5',
      store.uid,
    );
    const orderLines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        new IntegerUid(incrIntegerFactory.next()), // This will occur error
        store.uid,
        stoit.uid,
        new PriceDetail(10000),
      ),
    ];

    expect(() => OrderFactory.create(order, orderLines, [stoit], [store]))
      .toThrowError(new OrderUidNotMatchedError(order.uid, orderLines[0].uid, orderLines[0].orderUid));
  });

  it('should not create because stoit uids are duplicated', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'store 6',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'store item 6',
      'description 6',
      store.uid,
    );
    const orderLines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        store.uid,
        stoit.uid,
        new PriceDetail(10000),
      ),
    ];

    expect(() => {
      OrderFactory.create(order, orderLines, [stoit, stoit], [store]); // This will occur error
    }).toThrowError(new DuplicatedStoitUidError(stoit.uid));
  });

  it('should not create because store uids are duplicated', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'store 7',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'store item 7',
      'description 7',
      store.uid,
    );
    const orderLines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        store.uid,
        stoit.uid,
        new PriceDetail(10000),
      ),
    ];

    expect(() => {
      OrderFactory.create(order, orderLines, [stoit], [store, store]); // This will occur error
    }).toThrowError(new DuplicatedStoreUidError(store.uid));
  });
});
