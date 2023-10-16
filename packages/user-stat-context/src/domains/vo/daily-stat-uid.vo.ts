import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, IFactory, Validatable } from '@hexa/common/interfaces';
import { IntegerUid } from '@hexa/user-stat-context/domains/vo/integer-uid.vo';
import { DateTime } from 'luxon';

@AssertStaticInterface<ClassOf<DailyStatUid>>()
@AssertStaticInterface<Validatable>()
@AssertStaticInterface<IFactory<DailyStatUid>>()
export class DailyStatUid extends IntegerUid {
  public static create(baseDateTime = DateTime.now()) {
    return new DailyStatUid(baseDateTime.startOf('day').toUTC().millisecond);
  }
}
