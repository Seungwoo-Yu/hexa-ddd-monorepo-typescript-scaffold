import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';

@AssertStaticInterface<ClassOf<Price>>()
@AssertStaticInterface<Validatable>()
export class Price implements Equality {
  constructor(
    public readonly amount: number,
  ) {
    const result = z.number({ errorMap: unifyZodMessages('uid') })
      .int()
      .min(1000)
      .safeParse(amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.amount === other.amount;
  }

  public static isClassOf(target: unknown): target is Price {
    try {
      Price.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Price');
    }

    const result = z.number({ errorMap: unifyZodMessages('uid') })
      .int()
      .min(1000)
      .safeParse(target.amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
