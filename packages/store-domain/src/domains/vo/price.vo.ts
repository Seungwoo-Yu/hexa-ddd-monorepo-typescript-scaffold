import { Equality } from '@hexa/common/interfaces.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/equality.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';

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
      throw new UndefOrNullParamError();
    }

    return this.amount == other.amount;
  }
}
