import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { Enum } from '@hexa/common/types.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';

export const PointLossReason = [
  'bought_item',
  'lost_by_admin',
] as const;

@AssertStaticInterface<ClassOf<LossReason>>()
@AssertStaticInterface<Validatable>()
export class LossReason implements Equality {
  constructor(
    public readonly reason: Enum<typeof PointLossReason>,
  ) {
    LossReason.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.reason === other.reason;
  }

  public static isClassOf(target: unknown): target is LossReason {
    try {
      LossReason.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('LossReason');
    }

    const result = z.enum(PointLossReason, {
      errorMap: unifyZodMessages('reason'),
    }).safeParse(target.reason);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
