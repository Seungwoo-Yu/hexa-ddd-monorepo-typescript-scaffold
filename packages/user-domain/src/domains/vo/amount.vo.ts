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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.amount === other.amount;
  }

  public static isClassOf(target: unknown): target is Amount {
    try {
      Amount.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Amount');
    }

    const result = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .min(1)
      .safeParse(target.amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
