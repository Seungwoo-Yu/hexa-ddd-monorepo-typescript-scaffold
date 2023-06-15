import { z } from 'zod';
import { Equality } from '@hexa/common/interfaces.ts';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';

export class Balance implements Equality {
  constructor(
    public readonly amount: number,
  ) {
    const result = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .gte(0)
      .safeParse(amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }

  public deposit(amount: number) {
    const result = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .gte(0)
      .safeParse(amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }

    return new Balance(this.amount + amount);
  }

  public withdraw(amount: number) {
    const result = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .gte(0)
      .lte(this.amount)
      .safeParse(amount);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }

    return new Balance(this.amount - amount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): other is this {
    return other != null && this.amount === other.amount;
  }
}
