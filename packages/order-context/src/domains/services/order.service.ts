import { IOrderCommand } from '@hexa/order-context/domains/repositories/commands/order.command';
import { IOrderQuery } from '@hexa/order-context/domains/repositories/queries/order.query';
import { OmitFuncs } from '@hexa/common/types';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { OrderFactory } from '@hexa/order-context/domains/factories/order.factory';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';

export class OrderService {
  constructor(
    private readonly orderQuery: IOrderQuery,
    private readonly orderCommand: IOrderCommand,
  ) {
  }

  public async create(
    _order: Omit<OmitFuncs<Order>, 'uid' | 'createdAt'>,
    _lines: Omit<OmitFuncs<OrderLine>, 'uid' | 'orderUid'>[],
    stoits: OrderStoit[],
    stores: OrderStore[],
  ) {
    const nextId = await this.orderQuery.nextId();
    const order = new Order(
      nextId,
      _order.userUid,
      CreatedAt.create(),
    );
    const lines = _lines.map((line, index) => {
      return new OrderLine(
        new IntegerUid(index + 1),
        nextId,
        line.storeUid,
        line.stoitUid,
        line.priceDetail,
        line.refundReason,
        line.refundCreatedAt,
      );
    });
    const orderAgg = OrderFactory.create(order, lines, stoits, stores);

    await this.orderCommand.create(orderAgg);

    return orderAgg;
  }
}
