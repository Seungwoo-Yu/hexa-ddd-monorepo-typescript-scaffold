import { IOrderCommand } from '@hexa/order-stat-context/domains/repositories/commands/order.command';

export class InMemoryOrderRepo implements IOrderCommand {
  public async updateRefundStat() {}

  public async updateSalesStat() {}
}
