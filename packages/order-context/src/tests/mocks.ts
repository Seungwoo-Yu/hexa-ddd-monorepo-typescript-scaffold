import { IOrderCommand } from '@hexa/order-context/domains/repositories/commands/order.command';
import { IOrderQuery } from '@hexa/order-context/domains/repositories/queries/order.query';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OmitFuncs, PickNestedType, PickType } from '@hexa/common/types';
import { OrderAgg } from '@hexa/order-context/domains/aggs/order.agg';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';

export class InMemoryOrderRepo implements IOrderCommand, IOrderQuery {
  private readonly orderAggMap: Map<PickNestedType<Order, ['uid', 'uid']>, OrderAgg> = new Map();

  constructor(
    private readonly incrIntFactory = new IncrIntegerFactory(),
  ) {}

  public async create(orderAgg: OrderAgg) {
    this.orderAggMap.set(orderAgg.order.uid.uid, orderAgg);
  }

  public setOrderStoits(
    _stoits: Omit<OmitFuncs<OrderStoit>, 'uid'>[],
  ) {
    return _stoits.map(stoit => new OrderStoit(
      new IntegerUid(this.incrIntFactory.next()),
      stoit.name,
      stoit.description,
      stoit.storeUid,
    ));
  }

  public setOrderStores(
    _stores: Omit<OmitFuncs<OrderStore>, 'uid'>[],
  ) {
    return _stores.map(store => new OrderStore(
      new IntegerUid(this.incrIntFactory.next()),
      store.name,
      store.adminUid,
    ));
  }

  public async nextId(): Promise<IntegerUid> {
    return new IntegerUid(this.incrIntFactory.next());
  }

  public async exists(id: PickType<Order, 'uid'>): Promise<boolean> {
    return this.orderAggMap.has(id.uid);
  }

  public async readById(id: PickType<Order, 'uid'>): Promise<OrderAgg | undefined> {
    return this.orderAggMap.get(id.uid);
  }

  public async update(orderAgg: OrderAgg): Promise<void> {
    if (!this.orderAggMap.has(orderAgg.order.uid.uid)) {
      throw new Error('order not found');
    }

    this.orderAggMap.set(orderAgg.order.uid.uid, orderAgg);
  }
}
