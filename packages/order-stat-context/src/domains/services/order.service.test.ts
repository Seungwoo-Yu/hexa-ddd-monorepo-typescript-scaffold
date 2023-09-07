import { InMemoryOrderRepo } from '@hexa/order-stat-context/tests/mocks';
import { OrderAgg } from '@hexa/order-stat-context/domains/aggs/order.agg';
import { Order } from '@hexa/order-stat-context/domains/entities/order.entity';
import { OrderLine } from '@hexa/order-stat-context/domains/entities/order-line.entity';
import { IntegerUid } from '@hexa/order-stat-context/domains/vo/integer-uid.vo';
import { PriceDetail } from '@hexa/order-stat-context/domains/vo/price-detail.vo';
import { RefundReason } from '@hexa/order-stat-context/domains/vo/refund-reason.vo';
import {
  OrderLineNotFoundError,
  OrderService,
  RefundedOrderLineError, RefundedOrderLineRequiredError,
} from '@hexa/order-stat-context/domains/services/order.service';
import { CreatedAt } from '@hexa/order-stat-context/domains/vo/created-at.vo';

describe('order-stat-context order service test', () => {
  it('should update sales status for order line', async () => {
    const orderLine = new OrderLine(
      new IntegerUid(1),
      new PriceDetail(1),
    );
    const orderAgg = new OrderAgg(
      new Order(new IntegerUid(2)),
      [orderLine],
    );
    const repo = new InMemoryOrderRepo();
    const service = new OrderService(repo);

    await service.updateSalesStat(orderAgg, orderLine.uid);
  });

  it('should not update sales status for order line because of invalid order line uid', async () => {
    const orderLine = new OrderLine(
      new IntegerUid(1),
      new PriceDetail(1),
    );
    const orderAgg = new OrderAgg(
      new Order(new IntegerUid(2)),
      [orderLine],
    );
    const repo = new InMemoryOrderRepo();
    const service = new OrderService(repo);
    const invalidUid = new IntegerUid(3);

    await expect(() => service.updateSalesStat(orderAgg, invalidUid))
      .rejects.toThrowError(new OrderLineNotFoundError(orderAgg.order.uid, invalidUid));
  });

  it('should not update sales status for order line because it is refunded', async () => {
    const orderLine = new OrderLine(
      new IntegerUid(1),
      new PriceDetail(1),
      new RefundReason('requested_by_user'),
      CreatedAt.create(),
    );
    const orderAgg = new OrderAgg(
      new Order(new IntegerUid(2)),
      [orderLine],
    );
    const repo = new InMemoryOrderRepo();
    const service = new OrderService(repo);

    await expect(() => service.updateSalesStat(orderAgg, orderLine.uid))
      .rejects.toThrowError(new RefundedOrderLineError(orderLine.uid));
  });

  it('should update refund status for order line', async () => {
    const orderLine = new OrderLine(
      new IntegerUid(1),
      new PriceDetail(1),
      new RefundReason('requested_by_user'),
      CreatedAt.create(),
    );
    const orderAgg = new OrderAgg(
      new Order(new IntegerUid(2)),
      [orderLine],
    );
    const repo = new InMemoryOrderRepo();
    const service = new OrderService(repo);

    await service.updateRefundStat(orderAgg, orderLine.uid);
  });

  it('should not update refund status for order line because of invalid order line uid', async () => {
    const orderLine = new OrderLine(
      new IntegerUid(1),
      new PriceDetail(1),
      new RefundReason('requested_by_user'),
      CreatedAt.create(),
    );
    const orderAgg = new OrderAgg(
      new Order(new IntegerUid(2)),
      [orderLine],
    );
    const repo = new InMemoryOrderRepo();
    const service = new OrderService(repo);
    const invalidUid = new IntegerUid(3);

    await expect(() => service.updateRefundStat(orderAgg, invalidUid))
      .rejects.toThrowError(new OrderLineNotFoundError(orderAgg.order.uid, invalidUid));
  });

  it('should not update refund status for order line because it is not refunded', async () => {
    const orderLine = new OrderLine(
      new IntegerUid(1),
      new PriceDetail(1),
    );
    const orderAgg = new OrderAgg(
      new Order(new IntegerUid(2)),
      [orderLine],
    );
    const repo = new InMemoryOrderRepo();
    const service = new OrderService(repo);

    await expect(() => service.updateRefundStat(orderAgg, orderLine.uid))
      .rejects.toThrowError(new RefundedOrderLineRequiredError(orderLine.uid));
  });
});
