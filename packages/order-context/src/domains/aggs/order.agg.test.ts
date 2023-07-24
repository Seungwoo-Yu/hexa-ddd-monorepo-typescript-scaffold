import {
  DuplicatedOrderLineIdError,
  NoOrderLineFoundError,
  NoOrderStoreFoundError,
  OrderAgg,
} from '@hexa/order-context/domains/aggs/order.agg';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { UlidUid } from '@hexa/order-context/domains/vo/ulid-uid.vo';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { PriceDetail } from '@hexa/order-context/domains/vo/price-detail.vo';
import { OrderedMap } from 'immutable';
import { RefundReason } from '@hexa/order-context/domains/vo/refund-reason.vo';

describe('order-context order aggregate test', () => {
  it('should create successfully', function () {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'Store',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'Store item',
      'Description of store item',
      store.uid,
    );
    const lines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        stoit.uid,
        store.uid,
        new PriceDetail(10000),
      ),
    ];
    const agg = new OrderAgg(
      order,
      lines,
      OrderedMap([[stoit.uid.uid, stoit]]),
      OrderedMap([[store.uid.uid, store]]),
    );

    expect(agg.order.uid.uid).toStrictEqual(order.uid.uid);
    expect(agg.lines.length).toStrictEqual(1);
    expect(agg.lines[0].uid.uid).toStrictEqual(lines[0].uid.uid);
    expect(agg.stoits.length).toStrictEqual(1);
    expect(agg.stoits[0].uid.uid).toStrictEqual(stoit.uid.uid);
    expect(agg.stores[0].uid.uid).toStrictEqual(store.uid.uid);
  });

  it('should not create because order store item contains invalid order store uid', function () {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'Store 2',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'Store item 2',
      'Description of store item 2',
      new IntegerUid(9999), // This will occur error
    );
    const lines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        stoit.uid,
        store.uid,
        new PriceDetail(10000),
      ),
    ];

    expect(() => new OrderAgg(
      order,
      lines,
      OrderedMap([[stoit.uid.uid, stoit]]),
      OrderedMap([[store.uid.uid, store]]),
    )).toThrowError(new NoOrderStoreFoundError(stoit.storeUid));
  });

  it('should not create because there are duplicated order line uids', function () {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'Store 3',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'Store item 3',
      'Description of store item 3',
      store.uid,
    );
    const duplicatedUid = new IntegerUid(incrIntegerFactory.next());
    const lines = [
      new OrderLine(
        duplicatedUid, // This will occur error
        order.uid,
        stoit.uid,
        store.uid,
        new PriceDetail(10000),
      ),
      new OrderLine(
        duplicatedUid, // This will occur error
        order.uid,
        stoit.uid,
        store.uid,
        new PriceDetail(10000),
      ),
    ];

    expect(() => new OrderAgg(
      order,
      lines,
      OrderedMap([[stoit.uid.uid, stoit]]),
      OrderedMap([[store.uid.uid, store]]),
    )).toThrowError(new DuplicatedOrderLineIdError(duplicatedUid));
  });

  it('should refund successfully', function () {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'Store 4',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'Store item 4',
      'Description of store item 4',
      store.uid,
    );
    const lines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        stoit.uid,
        store.uid,
        new PriceDetail(10000),
      ),
    ];

    const agg = new OrderAgg(
      order,
      lines,
      OrderedMap([[stoit.uid.uid, stoit]]),
      OrderedMap([[store.uid.uid, store]]),
    );

    agg.refund(agg.lines[0].uid, new RefundReason('requested_by_user'));

    expect(agg.lines[0].refundReason).not.toBeUndefined();
    expect(agg.lines[0].refundReason).not.toBeNull();
    expect(agg.lines[0].refundReason!.reason).toStrictEqual('requested_by_user');
    expect(agg.lines[0].refundCreatedAt).not.toBeUndefined();
    expect(agg.lines[0].refundCreatedAt).not.toBeNull();
    expect(CreatedAt.isClassOf(agg.lines[0].refundCreatedAt)).toStrictEqual(true);
  });

  it('should not refund because of invalid order line uid', function () {
    const incrIntegerFactory = new IncrIntegerFactory();
    const order = new Order(
      new IntegerUid(incrIntegerFactory.next()),
      UlidUid.create(),
      CreatedAt.create(),
    );
    const store = new OrderStore(
      new IntegerUid(incrIntegerFactory.next()),
      'Store 5',
      UlidUid.create(),
    );
    const stoit = new OrderStoit(
      new IntegerUid(incrIntegerFactory.next()),
      'Store item 5',
      'Description of store item 5',
      store.uid,
    );
    const lines = [
      new OrderLine(
        new IntegerUid(incrIntegerFactory.next()),
        order.uid,
        stoit.uid,
        store.uid,
        new PriceDetail(10000),
      ),
    ];

    const agg = new OrderAgg(
      order,
      lines,
      OrderedMap([[stoit.uid.uid, stoit]]),
      OrderedMap([[store.uid.uid, store]]),
    );

    const uidNotUsed = new IntegerUid(incrIntegerFactory.next());

    expect(() => agg.refund(
      uidNotUsed, // This will occur error
      new RefundReason('requested_by_user'),
    )).toThrowError(new NoOrderLineFoundError(uidNotUsed));
  });
});
