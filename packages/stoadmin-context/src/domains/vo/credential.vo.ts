import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { CompositeValError } from '@hexa/common/errors/composite';
import { unifyZodMessages } from '@hexa/common/utils';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<CredentialId>>()
@AssertStaticInterface<Validatable>()
export class CredentialId implements Equality {
  constructor(
    public readonly id: string,
  ) {
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as CredentialId;

    return this.id === expected.id;
  }

  public static isClassOf(target: unknown): target is CredentialId {
    try {
      CredentialId.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('CredentialId');
    }
    const expected = target as CredentialId;

    const idResult = z.string({ errorMap: unifyZodMessages('id') })
      .min(1)
      .max(30)
      .refine(
        (id) => id === encodeURIComponent(id),
        'id contains unacceptable characters',
      ).safeParse(expected.id);

    if (!idResult.success) {
      throw CompositeValError.fromZodError(idResult.error);
    }
  }
}

@AssertStaticInterface<ClassOf<CredentialPassword>>()
@AssertStaticInterface<Validatable>()
export class CredentialPassword implements Equality {
  constructor(
    public readonly password: string,
  ) {
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as CredentialPassword;

    return this.password === expected.password;
  }

  public static isClassOf(target: unknown): target is CredentialPassword {
    try {
      CredentialPassword.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('CredentialPassword');
    }
    const expected = target as CredentialPassword;

    const pwResult = z.string({ errorMap: unifyZodMessages('password') })
      .min(1)
      .refine(
        (id) => id === encodeURIComponent(id),
        'password contains unacceptable characters',
      ).safeParse(expected.password);

    if (!pwResult.success) {
      throw CompositeValError.fromZodError(pwResult.error);
    }
  }
}

@AssertStaticInterface<ClassOf<Credential>>()
@AssertStaticInterface<Validatable>()
export class Credential implements Equality {
  constructor(
    public readonly id: CredentialId,
    public readonly password: CredentialPassword,
  ) {
    Credential.validate(this);
  }

  public updatePassword(newPassword: string) {
    return new Credential(this.id, new CredentialPassword(newPassword));
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as Credential;

    return this.id === expected.id && this.password === expected.password;
  }

  public static isClassOf(target: unknown): target is Credential {
    try {
      Credential.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Credential');
    }
    const expected = target as Credential;

    if (expected.id == null) {
      throw new UndefOrNullParamError('id');
    }
    CredentialId.validate(expected.id);

    if (expected.password == null) {
      throw new UndefOrNullParamError('password');
    }
    CredentialPassword.validate(expected.password);
  }
}
