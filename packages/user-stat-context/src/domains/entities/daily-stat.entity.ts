import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { DailyStatUid } from '@hexa/user-stat-context/domains/vo/daily-stat-uid.vo';
import { StatPoint } from '@hexa/user-stat-context/domains/vo/stat-point.vo';

@AssertStaticInterface<ClassOf<DailyStat>>()
@AssertStaticInterface<Validatable>()
export class DailyStat {
  constructor(
    public readonly uid: DailyStatUid,
    public statPoint: StatPoint,
  ) {
    DailyStat.validate(this);
  }

  public static isClassOf(target: unknown): target is DailyStat {
    try {
      DailyStat.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('DailyStat');
    }
    const expected = target as DailyStat;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    DailyStatUid.validate(expected.uid);

    if (expected.statPoint == null) {
      throw new UndefOrNullParamError('StatPoint');
    }
    StatPoint.validate(expected.statPoint);
  }
}
