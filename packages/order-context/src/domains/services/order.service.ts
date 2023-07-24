import { IOrderCommand } from '@hexa/order-context/domains/repositories/commands/order.command';
import { IOrderQuery } from '@hexa/order-context/domains/repositories/queries/order.query';
import { OmitFuncs } from '@hexa/common/types';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { OrderFactory } from '@hexa/order-context/domains/factories/order.factory';

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
    const [orderUid, createdAt] = await this.orderCommand.createOrder(_order);
    const lineUids = await this.orderCommand.createOrderLines(_lines.map(line => {
      return {
        orderUid: orderUid,
        storeUid: line.storeUid,
        stoitUid: line.stoitUid,
        priceDetail: line.priceDetail,
        refundReason: line.refundReason,
        refundCreatedAt: line.refundCreatedAt,
      };
    }));
    const order = new Order(
      orderUid,
      _order.userUid,
      createdAt,
    );
    const lines = _lines.map((line, index) => {
      return new OrderLine(
        lineUids[index],
        order.uid,
        line.storeUid,
        line.stoitUid,
        line.priceDetail,
        line.refundReason,
        line.refundCreatedAt,
      );
    });

    return OrderFactory.create(order, lines, stoits, stores);
  }
}
