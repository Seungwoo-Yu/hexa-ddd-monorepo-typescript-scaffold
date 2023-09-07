import { Order } from '@hexa/order-stat-context/domains/entities/order.entity';
import { OrderLine } from '@hexa/order-stat-context/domains/entities/order-line.entity';

export class EmptyOrderLineError extends Error {
  constructor() {
    super('order line cannot be empty');
  }
}

export class OrderAgg {
  constructor(
    public readonly order: Order,
    public readonly lines: OrderLine[],
  ) {
    if (this.lines.length === 0) {
      throw new EmptyOrderLineError();
    }
  }
}
