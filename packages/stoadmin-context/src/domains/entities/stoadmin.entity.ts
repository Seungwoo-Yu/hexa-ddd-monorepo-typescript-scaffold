import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';
import { StoadminName } from '@hexa/stoadmin-context/domains/vo/stoadmin-name.vo';
import { Credential } from '@hexa/stoadmin-context/domains/vo/credential.vo';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<Stoadmin>>()
@AssertStaticInterface<Validatable>()
export class Stoadmin {
  constructor(
    public readonly uid: UlidUid,
    public credential: Credential,
    public name: StoadminName,
  ) {
    Stoadmin.validate(this);
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

  public changeName(name: StoadminName) {
    if (this.name.equals(name)) {
      throw new Error('name is not changed');
    }

    this.name = name;
  }

  public static isClassOf(target: unknown): target is Stoadmin {
    try {
      Stoadmin.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Item');
    }
    const expected = target as Stoadmin;

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
    StoadminName.validate(expected.name);
  }
}
