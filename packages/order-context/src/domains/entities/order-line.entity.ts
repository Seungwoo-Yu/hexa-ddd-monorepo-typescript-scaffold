import { PickType } from '@hexa/common/types';
import { OrderStore } from '@hexa/order-context/domains/entities/order-store.entity';
import { OrderStoit } from '@hexa/order-context/domains/entities/order-stoit.entity';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';
import { RefundReason } from '@hexa/order-context/domains/vo/refund-reason.vo';
import { PriceDetail } from '@hexa/order-context/domains/vo/price-detail.vo';
import { Order } from '@hexa/order-context/domains/entities/order.entity';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

export class RefundedOrderLineError extends Error {
  constructor(uid: PickType<OrderLine, 'uid'>) {
    super('order line ' + uid.uid + ' is already refunded');
  }
}

@AssertStaticInterface<ClassOf<OrderLine>>()
@AssertStaticInterface<Validatable>()
export class OrderLine {
  constructor(
    public readonly uid: IntegerUid,
    public readonly orderUid: PickType<Order, 'uid'>,
    public readonly storeUid: PickType<OrderStore, 'uid'>,
    public readonly stoitUid: PickType<OrderStoit, 'uid'>,
    public readonly priceDetail: PriceDetail,
    public refundReason?: RefundReason,
    public refundCreatedAt?: CreatedAt,
  ) {
    OrderLine.isClassOf(this);
  }

  public refund(refundReason: RefundReason) {
    if (this.refundReason != null || this.refundCreatedAt != null) {
      throw new RefundedOrderLineError(this.uid);
    }

    this.refundReason = refundReason;
    this.refundCreatedAt = CreatedAt.create();
  }

  public static isClassOf(target: unknown): target is OrderLine {
    try {
      OrderLine.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('OrderLine');
    }
    const expected = target as OrderLine;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);

    if (expected.orderUid == null) {
      throw new UndefOrNullParamError('orderUid');
    }
    IntegerUid.validate(expected.orderUid);

    if (expected.storeUid == null) {
      throw new UndefOrNullParamError('storeUid');
    }
    IntegerUid.validate(expected.orderUid);

    if (expected.stoitUid == null) {
      throw new UndefOrNullParamError('stoitUid');
    }
    IntegerUid.validate(expected.stoitUid);

    if (expected.priceDetail == null) {
      throw new UndefOrNullParamError('priceDetail');
    }
    PriceDetail.validate(expected.priceDetail);

    if (expected.refundReason != null) {
      RefundReason.validate(expected.refundReason);
    }

    if (expected.refundCreatedAt != null) {
      CreatedAt.validate(expected.refundCreatedAt);
    }
  }
}
