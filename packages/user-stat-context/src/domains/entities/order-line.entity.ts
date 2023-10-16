import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { IntegerUid } from '@hexa/user-stat-context/domains/vo/integer-uid.vo';
import { CreatedAt } from '@hexa/user-stat-context/domains/vo/created-at.vo';
import { PriceDetail } from '@hexa/user-stat-context/domains/vo/price-detail.vo';
import { RefundReason } from '@hexa/user-stat-context/domains/vo/refund-reason.vo';

@AssertStaticInterface<ClassOf<OrderLine>>()
@AssertStaticInterface<Validatable>()
export class OrderLine {
  constructor(
    public readonly uid: IntegerUid,
    public readonly storeUid: IntegerUid,
    public readonly priceDetail: PriceDetail,
    public readonly orderCreatedAt: CreatedAt,
    public readonly refundReason?: RefundReason,
    public readonly refundCreatedAt?: CreatedAt,
  ) {
    OrderLine.isClassOf(this);
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

    if (expected.storeUid == null) {
      throw new UndefOrNullParamError('storeUid');
    }
    IntegerUid.validate(expected.storeUid);

    if (expected.priceDetail == null) {
      throw new UndefOrNullParamError('priceDetail');
    }
    PriceDetail.validate(expected.priceDetail);

    if (expected.orderCreatedAt == null) {
      throw new UndefOrNullParamError('orderCreatedAt');
    }
    CreatedAt.validate(expected.orderCreatedAt);

    if (expected.refundReason != null) {
      RefundReason.validate(expected.refundReason);
    }

    if (expected.refundCreatedAt != null) {
      CreatedAt.validate(expected.refundCreatedAt);
    }
  }
}
