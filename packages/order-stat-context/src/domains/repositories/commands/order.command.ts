import { OrderLine } from '@hexa/order-stat-context/domains/entities/order-line.entity';

export interface IOrderCommand {
  updateSalesStat(orderLine: OrderLine): Promise<void>,
  updateRefundStat(orderLine: OrderLine): Promise<void>,
}
