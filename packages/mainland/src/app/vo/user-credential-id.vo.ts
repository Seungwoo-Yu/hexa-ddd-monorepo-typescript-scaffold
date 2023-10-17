import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { CompositeValError } from '@hexa/common/errors/composite';
import { unifyZodMessages } from '@hexa/common/utils';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';

@AssertStaticInterface<ClassOf<UserCredentialId>>()
@AssertStaticInterface<Validatable>()
export class UserCredentialId implements Equality {
  constructor(
    public readonly id: string,
  ) {
    UserCredentialId.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as UserCredentialId;

    return this.id === expected.id;
  }

  public static fromUserCtx(credential: Credential) {
    return new UserCredentialId(credential.id);
  }

  public static isClassOf(target: unknown): target is UserCredentialId {
    try {
      UserCredentialId.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('UserCredentialId');
    }
    const expected = target as UserCredentialId;

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
