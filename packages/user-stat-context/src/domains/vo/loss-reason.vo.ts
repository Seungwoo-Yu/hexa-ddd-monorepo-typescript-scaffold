import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { Enum } from '@hexa/common/types';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';

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

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as LossReason;

    return this.reason === expected.reason;
  }

  public static isClassOf(target: unknown): target is LossReason {
    try {
      LossReason.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('LossReason');
    }
    const expected = target as LossReason;

    const result = z.enum(PointLossReason, {
      errorMap: unifyZodMessages('reason'),
    }).safeParse(expected.reason);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
