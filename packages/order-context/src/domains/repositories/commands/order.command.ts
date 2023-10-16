import { OrderAgg } from '@hexa/order-context/domains/aggs/order.agg';

export interface IOrderCommand {
  create(orderAgg: OrderAgg): Promise<void>,
  update(orderAgg: OrderAgg): Promise<void>,
}
