import { AssertStaticInterface } from '@hexa/common/decorators';
import { IFactory } from '@hexa/common/interfaces';
import { OrderAgg } from '@hexa/order-context/domains/aggs/order.agg';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { PickNestedType, PickType } from '@hexa/common/types';
import { OrderedMap } from 'immutable';

export class NoOrderLineError extends Error {
  constructor(orderUid: PickType<Order, 'uid'>) {
    super('no order line is found in order ' + orderUid.uid);
  }
}

export class OrderUidNotMatchedError extends Error {
  constructor(
    orderUid: PickType<Order, 'uid'>,
    lineUid: PickType<OrderLine, 'uid'>,
    invalidOrderUid: PickType<Order, 'uid'>,
  ) {
    super('order ' + invalidOrderUid.uid + ' found in order line ' + lineUid.uid +
      ' is not matched with order ' + orderUid.uid);
  }
}

export class NoOrderStoitError extends Error {
  constructor(stoitUid: PickType<OrderStoit, 'uid'>) {
    super('store item ' + stoitUid + ' is not found');
  }
}

export class NoOrderStoreError extends Error {
  constructor(storeUid: PickType<OrderStore, 'uid'>) {
    super('store ' + storeUid + ' is not found');
  }
}

export class DuplicatedStoitUidError extends Error {
  constructor(stoitUid: PickType<OrderStoit, 'uid'>) {
    super('store item uid ' + stoitUid + ' is duplicated');
  }
}

export class DuplicatedStoreUidError extends Error {
  constructor(stoitUid: PickType<OrderStoit, 'uid'>) {
    super('store uid ' + stoitUid + ' is duplicated');
  }
}

@AssertStaticInterface<IFactory<OrderAgg>>()
export class OrderFactory {
  public static create(
    order: Order,
    lines: OrderLine[],
    _stoits: OrderStoit[],
    _stores: OrderStore[],
  ) {
    if (lines == null || lines.length === 0) {
      throw new NoOrderLineError(order.uid);
    }

    lines.forEach(line => {
      if (!line.orderUid.equals(order.uid)) {
        throw new OrderUidNotMatchedError(order.uid, line.uid, line.orderUid);
      }

      const stoit = _stoits.find(stoit => stoit.uid.equals(line.stoitUid));
      if (stoit == null) {
        throw new NoOrderStoitError(line.stoitUid);
      }

      const store = _stores.find(store => store.uid.equals(line.storeUid));
      if (store == null) {
        throw new NoOrderStoreError(line.storeUid);
      }
    });

    let stoits = OrderedMap<PickNestedType<OrderStoit, ['uid', 'uid']>, OrderStoit>();

    _stoits.forEach(stoit => {
      if (stoits.has(stoit.uid.uid)) {
        throw new DuplicatedStoitUidError(stoit.uid);
      }

      stoits = stoits.set(stoit.uid.uid, stoit);
    });

    let stores = OrderedMap<PickNestedType<OrderStoit, ['uid', 'uid']>, OrderStore>();

    _stores.forEach(store => {
      if (stores.has(store.uid.uid)) {
        throw new DuplicatedStoreUidError(store.uid);
      }

      stores = stores.set(store.uid.uid, store);
    });

    return new OrderAgg(order, lines, stoits, stores);
  }
}
