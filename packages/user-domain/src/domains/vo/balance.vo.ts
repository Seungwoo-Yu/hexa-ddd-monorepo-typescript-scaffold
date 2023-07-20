import { z } from 'zod';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.amount === other.amount;
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
