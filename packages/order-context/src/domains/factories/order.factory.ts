import { AssertStaticInterface } from '@hexa/common/decorators';
import { GeneratorOf } from '@hexa/common/interfaces';
import { OrderAgg } from '@hexa/order-context/domains/aggs/order.agg';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { OmitFuncs, PickNestedType, PickType } from '@hexa/common/types';
import { OrderedMap } from 'immutable';
import { IOrderQuery } from '@hexa/order-context/domains/repositories/queries/order.query';
import { IOrderCommand } from '@hexa/order-context/domains/repositories/commands/order.command';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';

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

@AssertStaticInterface<GeneratorOf<OrderAgg>>()
export class OrderFactory {
  public static create(
    order: Order,
    lines: OrderLine[],
    stoits: OrderStoit[],
    _stores: OrderStore[],
  ) {
    if (lines == null || lines.length === 0) {
      throw new NoOrderLineError(order.uid);
    }

    let _stoits = OrderedMap<PickNestedType<OrderStoit, ['uid', 'uid']>, OrderStoit>();
    stoits.forEach(stoit => {
      if (_stoits.has(stoit.uid.uid)) {
        throw new DuplicatedStoitUidError(stoit.uid);
      }

      _stoits = _stoits.set(stoit.uid.uid, stoit);
    });

    let stores = OrderedMap<PickNestedType<OrderStoit, ['uid', 'uid']>, OrderStore>();
    _stores.forEach(store => {
      if (stores.has(store.uid.uid)) {
        throw new DuplicatedStoreUidError(store.uid);
      }

      stores = stores.set(store.uid.uid, store);
    });

    lines.forEach(line => {
      if (!line.orderUid.equals(order.uid)) {
        throw new OrderUidNotMatchedError(order.uid, line.uid, line.orderUid);
      }

      const stoit = _stoits.get(line.stoitUid.uid);
      if (stoit == null) {
        throw new NoOrderStoitError(line.stoitUid);
      }

      const store = stores.get(line.storeUid.uid);
      if (store == null) {
        throw new NoOrderStoreError(line.storeUid);
      }
    });

    return new OrderAgg(order, lines, stoits, stores);
  }

  public static async generate(
    orderQuery: IOrderQuery,
    orderCommand: IOrderCommand,
    _order: Omit<OmitFuncs<Order>, 'uid' | 'createdAt'>,
    _lines: Omit<OmitFuncs<OrderLine>, 'uid' | 'orderUid'>[],
    stoits: OrderStoit[],
    stores: OrderStore[],
  ) {
    const nextId = await orderQuery.nextId();
    const order = new Order(
      nextId,
      _order.userUid,
      CreatedAt.create(),
    );
    const lines = _lines.map((line, index) => {
      return new OrderLine(
        new IntegerUid(index + 1),
        nextId,
        line.storeUid,
        line.stoitUid,
        line.priceDetail,
        line.refundReason,
        line.refundCreatedAt,
      );
    });
    const orderAgg = OrderFactory.create(order, lines, stoits, stores);

    await orderCommand.create(orderAgg);

    return orderAgg;
  }
}
