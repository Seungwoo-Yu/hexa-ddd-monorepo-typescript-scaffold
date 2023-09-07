import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { IntegerUid } from '@hexa/order-stat-context/domains/vo/integer-uid.vo';
import { PriceDetail } from '@hexa/order-stat-context/domains/vo/price-detail.vo';
import { RefundReason } from '@hexa/order-stat-context/domains/vo/refund-reason.vo';
import { CreatedAt } from '@hexa/order-stat-context/domains/vo/created-at.vo';

@AssertStaticInterface<ClassOf<OrderLine>>()
@AssertStaticInterface<Validatable>()
export class OrderLine {
  constructor(
    public readonly uid: IntegerUid,
    public readonly priceDetail: PriceDetail,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('OrderLine');
    }
    const expected = target as OrderLine;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);

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
