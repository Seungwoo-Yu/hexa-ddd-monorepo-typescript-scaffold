import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { UlidUid } from '@hexa/user-stat-context/domains/vo/ulid-uid.vo';

@AssertStaticInterface<ClassOf<User>>()
@AssertStaticInterface<Validatable>()
export class User {
  constructor(
    public readonly uid: UlidUid,
  ) {
    User.validate(this);
  }

  public static isClassOf(target: unknown): target is User {
    try {
      User.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('User');
    }
    const expected = target as User;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    UlidUid.validate(expected.uid);
  }
}
