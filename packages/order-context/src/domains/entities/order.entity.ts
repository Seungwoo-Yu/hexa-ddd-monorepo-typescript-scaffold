import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { UlidUid } from '@hexa/order-context/domains/vo/ulid-uid.vo';

@AssertStaticInterface<ClassOf<Order>>()
@AssertStaticInterface<Validatable>()
export class Order {
  constructor(
    public readonly uid: IntegerUid,
    public readonly userUid: UlidUid,
    public readonly createdAt: CreatedAt,
  ) {
    Order.validate(this);
  }

  public static isClassOf(target: unknown): target is Order {
    try {
      Order.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Order');
    }
    const expected = target as Order;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);

    if (expected.userUid == null) {
      throw new UndefOrNullParamError('userUid');
    }
    UlidUid.validate(expected.userUid);

    if (expected.createdAt == null) {
      throw new UndefOrNullParamError('createdAt');
    }
    CreatedAt.validate(expected.createdAt);
  }
}
