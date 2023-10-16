import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { Amount } from '@hexa/user-context/domains/vo/amount.vo';

@AssertStaticInterface<ClassOf<Balance>>()
@AssertStaticInterface<Validatable>()
export class Balance implements Equality {
  constructor(
    public readonly amount: number,
  ) {
    Balance.validate(this);
  }

  public deposit(depositAmount: Amount) {
    return new Balance(this.amount + depositAmount.amount);
  }

  public withdraw(_withdrawAmount: Amount) {
    const withdrawAmount = _withdrawAmount.amount;
    const result = z.number({ errorMap: unifyZodMessages('withdrawAmount') })
      .lte(this.amount)
      .safeParse(withdrawAmount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }

    return new Balance(this.amount - withdrawAmount);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as Balance;

    return this.amount === expected.amount;
  }

  public static isClassOf(target: unknown): target is Balance {
    try {
      Balance.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Balance');
    }
    const expected = target as Balance;

    const result = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .gte(0)
      .safeParse(expected.amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
