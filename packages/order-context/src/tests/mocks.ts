import { IOrderCommand } from '@hexa/order-context/domains/repositories/commands/order.command';
import { IOrderQuery } from '@hexa/order-context/domains/repositories/queries/order.query';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OmitFuncs, PickNestedType, PickType } from '@hexa/common/types';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { OrderAgg } from '@hexa/order-context/domains/aggs/order.agg';
import { OrderedMap } from 'immutable';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';

export class InMemoryOrderRepo implements IOrderCommand, IOrderQuery {
  private readonly orderMap: Map<PickNestedType<Order, ['uid', 'uid']>, Order> = new Map();
  private readonly orderAggMap: Map<PickNestedType<Order, ['uid', 'uid']>, OrderAgg> = new Map();
  private stoits: OrderStoit[] = [];
  private stores: OrderedMap<PickNestedType<OrderStore, ['uid', 'uid']>, OrderStore> = OrderedMap();

  constructor(
    private readonly incrIntFactory = new IncrIntegerFactory(),
  ) {}

  public async createOrder(
    _order: Omit<OmitFuncs<Order>, 'uid' | 'createdAt'>,
  ): Promise<[PickType<Order, 'uid'>, PickType<Order, 'createdAt'>]> {
    const uid = new IntegerUid(this.incrIntFactory.next());
    const order = new Order(
      uid,
      _order.userUid,
      CreatedAt.create(),
    );

    this.orderMap.set(uid.uid, order);
    return [order.uid, order.createdAt];
  }

  public async createOrderLines(_lines: Omit<OmitFuncs<OrderLine>, 'uid'>[]): Promise<PickType<OrderLine, 'uid'>[]> {
    const order = this.orderMap.get(_lines[0].orderUid.uid);

    if (order == null) {
      throw new Error('order not found');
    }

    const lines = _lines.map(line => new OrderLine(
      new IntegerUid(this.incrIntFactory.next()),
      line.orderUid,
      line.storeUid,
      line.stoitUid,
      line.priceDetail,
      line.refundReason,
      line.refundCreatedAt,
    ));

    this.orderAggMap.set(
      order.uid.uid,
      new OrderAgg(order, lines, this.stoits, this.stores),
    );

    return lines.map(line => line.uid);
  }

  public setOrderStoits(
    _stoits: Omit<OmitFuncs<OrderStoit>, 'uid'>[],
  ) {
    const stoits = _stoits.map(stoit => new OrderStoit(
      new IntegerUid(this.incrIntFactory.next()),
      stoit.name,
      stoit.description,
      stoit.storeUid,
    ));

    this.stoits = stoits;

    return stoits;
  }

  public setOrderStores(
    _stores: Omit<OmitFuncs<OrderStore>, 'uid'>[],
  ) {
    const stores = _stores.map(store => new OrderStore(
      new IntegerUid(this.incrIntFactory.next()),
      store.name,
      store.adminUid,
    ));

    this.stores = OrderedMap(stores.map(stoit => [stoit.uid.uid, stoit]));

    return stores;
  }

  public async exists(id: PickType<Order, 'uid'>): Promise<boolean> {
    return this.orderAggMap.has(id.uid);
  }

  public async readById(id: PickType<Order, 'uid'>): Promise<OrderAgg | undefined> {
    return this.orderAggMap.get(id.uid);
  }

  public async updateOrder(orderAgg: OrderAgg): Promise<void> {
    if (!this.orderAggMap.has(orderAgg.order.uid.uid)) {
      throw new Error('order not found');
    }

    this.orderAggMap.set(orderAgg.order.uid.uid, orderAgg);
  }
}
