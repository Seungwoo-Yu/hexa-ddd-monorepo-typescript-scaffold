import { OrderAgg } from '@hexa/order-stat-context/domains/aggs/order.agg';
import { IOrderCommand } from '@hexa/order-stat-context/domains/repositories/commands/order.command';
import { IntegerUid } from '@hexa/order-stat-context/domains/vo/integer-uid.vo';
import { PickType } from '@hexa/common/types';
import { OrderLine } from '@hexa/order-stat-context/domains/entities/order-line.entity';
import { Order } from '@hexa/order-stat-context/domains/entities/order.entity';

export class OrderLineNotFoundError extends Error {
  constructor(orderUid: PickType<Order, 'uid'>, orderLineUid: PickType<OrderLine, 'uid'>) {
    super(`order line ${orderLineUid.uid} is not found in order ${orderUid.uid}`);
  }
}

export class RefundedOrderLineError extends Error {
  constructor(orderLineUid: PickType<Order, 'uid'>) {
    super(`order line ${orderLineUid.uid} is already refunded`);
  }
}

export class RefundedOrderLineRequiredError extends Error {
  constructor(orderLineUid: PickType<Order, 'uid'>) {
    super(`order line ${orderLineUid.uid} is not refunded yet`);
  }
}

export class OrderService {
  constructor(
    private readonly orderCommand: IOrderCommand,
  ) {
  }

  public async updateSalesStat(orderAgg: OrderAgg, orderLineUid: IntegerUid) {
    const line = orderAgg.lines.find(line => line.uid.equals(orderLineUid));
    if (line == null) {
      throw new OrderLineNotFoundError(orderAgg.order.uid, orderLineUid);
    }

    if (line.refundReason != null || line.refundCreatedAt != null) {
      throw new RefundedOrderLineError(orderLineUid);
    }

    await this.orderCommand.updateSalesStat(line);
  }

  public async updateRefundStat(orderAgg: OrderAgg, orderLineUid: IntegerUid) {
    const line = orderAgg.lines.find(line => line.uid.equals(orderLineUid));
    if (line == null) {
      throw new OrderLineNotFoundError(orderAgg.order.uid, orderLineUid);
    }

    if (line.refundReason == null || line.refundCreatedAt == null) {
      throw new RefundedOrderLineRequiredError(orderLineUid);
    }

    await this.orderCommand.updateRefundStat(line);
  }
}
