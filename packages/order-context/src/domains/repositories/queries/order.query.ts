import { PickType } from '@hexa/common/types';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OrderAgg } from '@hexa/order-context/domains/aggs/order.agg';

export interface IOrderQuery {
  nextId(): Promise<PickType<Order, 'uid'>>,
  readById(id: PickType<Order, 'uid'>): Promise<OrderAgg | undefined>,
  exists(id: PickType<Order, 'uid'>): Promise<boolean>,
}
