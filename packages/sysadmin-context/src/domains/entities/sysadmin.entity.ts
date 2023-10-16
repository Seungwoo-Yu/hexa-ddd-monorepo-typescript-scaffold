import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { UlidUid } from '@hexa/sysadmin-context/domains/vo/ulid-uid.vo';
import { Name } from '@hexa/sysadmin-context/domains/vo/name.vo';
import { Credential } from '@hexa/sysadmin-context/domains/vo/credential.vo';

@AssertStaticInterface<ClassOf<Sysadmin>>()
@AssertStaticInterface<Validatable>()
export class Sysadmin {
  constructor(
    public readonly uid: UlidUid,
    public credential: Credential,
    public name: Name,
  ) {
    Sysadmin.validate(this);
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

  public static isClassOf(target: unknown): target is Sysadmin {
    try {
      Sysadmin.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Sysadmin');
    }
    const expected = target as Sysadmin;

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
  }
}
