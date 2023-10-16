import { IntegerUid } from '@hexa/order-stat-context/domains/vo/integer-uid.vo';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<Order>>()
@AssertStaticInterface<Validatable>()
export class Order {
  constructor(
    public readonly uid: IntegerUid,
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
      throw new UndefOrNullParamError('User');
    }
    const expected = target as Order;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);
  }
}
