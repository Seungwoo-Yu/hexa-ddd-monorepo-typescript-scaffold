import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { AssertStaticInterface } from '@hexa/common/decorators';

@AssertStaticInterface<ClassOf<Price>>()
@AssertStaticInterface<Validatable>()
export class Price implements Equality {
  constructor(
    public readonly amount: number,
  ) {
    Price.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as Price;

    return this.amount === expected.amount;
  }

  public static isClassOf(target: unknown): target is Price {
    try {
      Price.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Price');
    }
    const expected = target as Price;

    const result = z.number({ errorMap: unifyZodMessages('uid') })
      .int()
      .min(1000)
      .safeParse(expected.amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
