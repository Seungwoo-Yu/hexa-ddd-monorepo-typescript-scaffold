import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { IntegerUid } from '@hexa/order-stat-context/domains/vo/integer-uid.vo';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { StatOrder } from '@hexa/order-stat-context/domains/vo/stat-order.vo';

@AssertStaticInterface<ClassOf<StatStore>>()
@AssertStaticInterface<Validatable>()
export class StatStore {
  constructor(
    public readonly uid: IntegerUid,
    public statOrder: StatOrder,
  ) {
  }

  public static isClassOf(target: unknown): target is StatStore {
    try {
      StatStore.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('StatStore');
    }
    const expected = target as StatStore;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);

    if (expected.statOrder == null) {
      throw new UndefOrNullParamError('statOrder');
    }
    StatOrder.validate(expected.statOrder);
  }
}
