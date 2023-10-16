import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { AssertStaticInterface } from '@hexa/common/decorators';

@AssertStaticInterface<ClassOf<Amount>>()
@AssertStaticInterface<Validatable>()
export class Amount implements Equality {
  constructor(
    public readonly amount: number,
  ) {
    Amount.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as Amount;

    return this.amount === expected.amount;
  }

  public static isClassOf(target: unknown): target is Amount {
    try {
      Amount.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Amount');
    }
    const expected = target as Amount;

    const result = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .min(1)
      .safeParse(expected.amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
