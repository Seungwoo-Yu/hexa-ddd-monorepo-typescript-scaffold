import { OmitFuncs, PickType } from '@hexa/common/types';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OrderAgg } from '@hexa/order-context/domains/aggs/order.agg';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';

export interface IOrderCommand {
  createOrder(
    order: Omit<OmitFuncs<Order>, 'uid' | 'createdAt'>,
  ): Promise<[PickType<Order, 'uid'>, PickType<Order, 'createdAt'>]>,
  updateOrder(orderAgg: OrderAgg): Promise<void>,
  createOrderLines(lines: Omit<OmitFuncs<OrderLine>, 'uid'>[]): Promise<PickType<OrderLine, 'uid'>[]>,
}
