import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
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