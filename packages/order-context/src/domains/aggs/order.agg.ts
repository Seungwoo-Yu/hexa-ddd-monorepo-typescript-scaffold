import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { OrderedMap } from 'immutable';
import { OrderLine } from '@hexa/order-context/domains/entities/order-line.entity';
import { PickNestedType, PickType } from '@hexa/common/types';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { RefundReason } from '@hexa/order-context/domains/vo/refund-reason.vo';

export class EmptyOrderLineError extends Error {
  constructor() {
    super('order line cannot be empty');
  }
}

export class NoOrderStoreFoundError extends Error {
  constructor(
    storeId: PickType<OrderStore, 'uid'>,
  ) {
    super('order store ' + storeId.uid + ' is not found');
  }
}

export class DuplicatedOrderLineIdError extends Error {
  constructor(
    lineId: PickType<OrderLine, 'uid'>,
  ) {
    super('order line id ' + lineId.uid + ' is duplicated');
  }
}

export class NoOrderLineFoundError extends Error {
  constructor(
    lineId: PickType<OrderLine, 'uid'>,
  ) {
    super('order line ' + lineId.uid + ' is not found');
  }
}

export class OrderAgg {
  private lineIdxMap = OrderedMap<PickNestedType<OrderLine, ['uid', 'uid']>, number>();
  public readonly stoits: OrderStoit[];
  public readonly stores: OrderStore[];

  constructor(
    public readonly order: Order,
    public readonly lines: OrderLine[],
    _stoits: OrderedMap<PickNestedType<OrderStoit, ['uid', 'uid']>, OrderStoit>,
    _stores: OrderedMap<PickNestedType<OrderStore, ['uid', 'uid']>, OrderStore>,
  ) {
    if (this.lines.length === 0) {
      throw new EmptyOrderLineError();
    }

    this.stoits = _stoits.valueSeq().toArray();
    this.stores = _stores.valueSeq().toArray();

    this.stoits.forEach(stoit => {
      if (!_stores.has(stoit.storeUid.uid)) {
        throw new NoOrderStoreFoundError(stoit.storeUid);
      }
    });

    this.lines.forEach((line, index) => {
      if (this.lineIdxMap.has(line.uid.uid)) {
        throw new DuplicatedOrderLineIdError(line.uid);
      }

      this.lineIdxMap = this.lineIdxMap.set(line.uid.uid, index);
    });
  }

  public refund(lineUid: PickType<OrderLine, 'uid'>, refundReason: RefundReason) {
    const lineIdx = this.lineIdxMap.get(lineUid.uid);
    if (lineIdx == null) {
      throw new NoOrderLineFoundError(lineUid);
    }

    this.lines[lineIdx].refund(refundReason);
  }
}
