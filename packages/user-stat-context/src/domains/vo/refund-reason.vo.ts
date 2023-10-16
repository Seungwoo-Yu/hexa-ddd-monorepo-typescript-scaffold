import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { unifyZodMessages } from '@hexa/common/utils';
import { z } from 'zod';
import { CompositeValError } from '@hexa/common/errors/composite';
import { Enum } from '@hexa/common/types';

export const OrderRefundReason = [
  'requested_by_user',
  'requested_by_store_admin',
] as const;

@AssertStaticInterface<ClassOf<RefundReason>>()
@AssertStaticInterface<Validatable>()
export class RefundReason implements Equality {
  constructor(
    public readonly reason: Enum<typeof OrderRefundReason>,
  ) {
    RefundReason.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.reason === other.reason;
  }

  public static isClassOf(target: unknown): target is RefundReason {
    try {
      RefundReason.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('RefundReason');
    }

    const reasonResult = z.enum(OrderRefundReason, {
      errorMap: unifyZodMessages('reason'),
    }).safeParse(target.reason);

    if (!reasonResult.success) {
      throw CompositeValError.fromZodError(reasonResult.error);
    }
  }
}
