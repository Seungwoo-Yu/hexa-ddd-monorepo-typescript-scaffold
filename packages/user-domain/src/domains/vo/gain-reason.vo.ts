import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { Enum } from '@hexa/common/types';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';

export const PointGainReason = [
  'gained_by_admin',
] as const;

@AssertStaticInterface<ClassOf<GainReason>>()
@AssertStaticInterface<Validatable>()
export class GainReason implements Equality {
  constructor(
    public readonly reason: Enum<typeof PointGainReason>,
  ) {
    GainReason.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.reason === other.reason;
  }

  public static isClassOf(target: unknown): target is GainReason {
    try {
      GainReason.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('GainReason');
    }

    const result = z.enum(PointGainReason, {
      errorMap: unifyZodMessages('reason'),
    }).safeParse(target.reason);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
