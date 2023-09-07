import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { CompositeValError } from '@hexa/common/errors/composite';
import { unifyZodMessages } from '@hexa/common/utils';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<Credential>>()
@AssertStaticInterface<Validatable>()
export class Credential implements Equality {
  constructor(
    public readonly id: string,
    public readonly password: string,
  ) {
    Credential.validate(this);
  }

  public updatePassword(newPassword: string) {
    return new Credential(this.id, newPassword);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.id === other.id && this.password === other.password;
  }

  public static isClassOf(target: unknown): target is Credential {
    try {
      Credential.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Credential');
    }

    const idResult = z.string({ errorMap: unifyZodMessages('id') })
      .nonempty()
      .min(1)
      .max(30)
      .refine(
        (id) => id === encodeURIComponent(id),
        'id contains unacceptable characters',
      ).safeParse(target.id);

    if (!idResult.success) {
      throw CompositeValError.fromZodError(idResult.error);
    }

    const pwResult = z.string({ errorMap: unifyZodMessages('password') })
      .nonempty()
      .min(1)
      .refine(
        (id) => id === encodeURIComponent(id),
        'password contains unacceptable characters',
      ).safeParse(target.password);

    if (!pwResult.success) {
      throw CompositeValError.fromZodError(pwResult.error);
    }
  }
}
