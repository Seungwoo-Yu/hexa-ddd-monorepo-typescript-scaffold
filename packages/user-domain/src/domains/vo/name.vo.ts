import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';

@AssertStaticInterface<ClassOf<Name>>()
@AssertStaticInterface<Validatable>()
export class Name implements Equality {
  constructor(
    public readonly nickname: string,
  ) {
    Name.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.nickname === other.nickname;
  }

  public static isClassOf(target: unknown): target is Name {
    try {
      Name.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Name');
    }

    const result = z.string({ errorMap: unifyZodMessages('nickname') })
      .min(5)
      .max(20)
      .refine(
        (id) => id === encodeURIComponent(id),
        'nickname contains unacceptable characters',
      )
      .safeParse(target.nickname);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}

