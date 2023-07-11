import { Balance } from '@hexa/user-domain/domains/vo/balance.vo.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { ClassOf, Validatable } from '@hexa/common/interfaces.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';

@AssertStaticInterface<ClassOf<User>>()
@AssertStaticInterface<Validatable>()
export class User {
  constructor(
    public readonly uid: UlidUid,
    public credential: Credential,
    public name: Name,
    public balance: Balance,
  ) {
    User.validate(this);
  }

  public changeCredential(credential: Credential) {
    if (this.credential.id !== credential.id) {
      throw new Error('id must be immutable');
    }

    if (this.credential.equals(credential)) {
      throw new Error('credential is not changed');
    }

    this.credential = credential;
  }

  public changeName(name: Name) {
    if (this.name.equals(name)) {
      throw new Error('name is not changed');
    }

    this.name = name;
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

    if (expected.credential == null) {
      throw new UndefOrNullParamError('credential');
    }
    Credential.validate(expected.credential);

    if (expected.name == null) {
      throw new UndefOrNullParamError('name');
    }
    Name.validate(expected.name);

    if (expected.balance == null) {
      throw new UndefOrNullParamError('balance');
    }
    Balance.validate(expected.balance);
  }
}
