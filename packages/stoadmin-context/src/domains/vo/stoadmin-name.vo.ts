import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<StoadminName>>()
@AssertStaticInterface<Validatable>()
export class StoadminName implements Equality {
  constructor(
    public readonly nickname: string,
  ) {
    StoadminName.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.nickname === other.nickname;
  }

  public static isClassOf(target: unknown): target is StoadminName {
    try {
      StoadminName.validate(target);
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

