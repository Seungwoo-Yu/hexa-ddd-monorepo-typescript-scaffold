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

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as StoadminName;

    return this.nickname === expected.nickname;
  }

  public static isClassOf(target: unknown): target is StoadminName {
    try {
      StoadminName.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Name');
    }
    const expected = target as StoadminName;

    const result = z.string({ errorMap: unifyZodMessages('nickname') })
      .min(5)
      .max(20)
      .refine(
        (id) => id === encodeURIComponent(id),
        'nickname contains unacceptable characters',
      )
      .safeParse(expected.nickname);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}

