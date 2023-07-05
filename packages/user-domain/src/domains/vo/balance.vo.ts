import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';

@AssertStaticInterface<ClassOf<Balance>>()
@AssertStaticInterface<Validatable>()
export class Balance implements Equality {
  constructor(
    public readonly amount: number,
  ) {
    Balance.validate(this);
  }

  public deposit(depositAmount: number) {
    const result = z.number({ errorMap: unifyZodMessages('depositAmount') })
      .int()
      .gte(0)
      .safeParse(depositAmount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }

    return new Balance(this.amount + depositAmount);
  }

  public withdraw(withdrawAmount: number) {
    const result = z.number({ errorMap: unifyZodMessages('withdrawAmount') })
      .int()
      .gte(0)
      .lte(this.amount)
      .safeParse(withdrawAmount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }

    return new Balance(this.amount - withdrawAmount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    return other != null && this.amount === other.amount;
  }

  public static isClassOf(target: unknown): target is Balance {
    try {
      Balance.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Balance');
    }

    const result = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .gte(0)
      .safeParse(target.amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
