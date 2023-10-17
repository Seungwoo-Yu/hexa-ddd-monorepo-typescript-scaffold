import { Balance } from '@hexa/user-context/domains/vo/balance.vo';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, IFactory, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<User>>()
@AssertStaticInterface<Validatable>()
@AssertStaticInterface<IFactory<User>>()
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

  public changeBalance(balance: Balance) {
    if (this.balance.equals(balance)) {
      throw new Error('balance is not changed');
    }

    this.balance = balance;
  }

  public static create(credential: Credential, name: Name) {
    return new User(
      UlidUid.create(),
      credential,
      name,
      new Balance(0),
    );
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
