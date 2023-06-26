import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { Enum, PickAndType } from '@hexa/common/types.ts';
import { z } from 'zod';
import { isValid as isValidUlid } from 'ulidx';
import { ClassOf, Equality } from '@hexa/common/interfaces.ts';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';

export const PointGainReason = [
  'gained_by_admin',
] as const;

export const PointLossReason = [
  'bought_item',
  'lost_by_admin',
] as const;

export interface IPointLog extends Equality {
  userUid: PickAndType<User, 'uid'>,
  amount: number,
}

// noinspection JSUnusedGlobalSymbols
@AssertStaticInterface<ClassOf<PointGainLog>>()
export class PointGainLog implements IPointLog {
  constructor(
    public readonly userUid: PickAndType<User, 'uid'>,
    public readonly reason: Enum<typeof PointGainReason>,
    public readonly amount: number,
  ) {
    const userUidResult = z.string({
      errorMap: unifyZodMessages('userUid'),
    }).nonempty()
      .refine(_uid => {
        return isValidUlid(_uid);
      })
      .safeParse(userUid.uid);

    if (!userUidResult.success) {
      throw CompositeValError.fromZodError(userUidResult.error);
    }

    const reasonResult = z.enum(PointGainReason, {
      errorMap: unifyZodMessages('userUid'),
    }).safeParse(reason);

    if (!reasonResult.success) {
      throw CompositeValError.fromZodError(reasonResult.error);
    }

    const amountResult = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .gt(0)
      .safeParse(amount);

    if (!amountResult.success) {
      throw CompositeValError.fromZodError(amountResult.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    return other != null && this.userUid === other.userUid &&
      this.reason === other.reason && this.amount === other.amount;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isClassOf(target: any): target is PointGainLog {
    return target != null &&
      target.userUid != null && target.userUid !== '' &&
      target.reason != null && PointGainReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}

// noinspection JSUnusedGlobalSymbols
@AssertStaticInterface<ClassOf<PointLossLog>>()
export class PointLossLog implements IPointLog {
  constructor(
    public readonly userUid: PickAndType<User, 'uid'>,
    public readonly reason: Enum<typeof PointLossReason>,
    public readonly amount: number,
  ) {
    const userUidResult = z.string({
      errorMap: unifyZodMessages('userUid'),
    }).nonempty()
      .refine(_uid => isValidUlid(_uid))
      .safeParse(userUid.uid);

    if (!userUidResult.success) {
      throw CompositeValError.fromZodError(userUidResult.error);
    }

    const reasonResult = z.enum(PointLossReason, {
      errorMap: unifyZodMessages('userUid'),
    }).safeParse(reason);

    if (!reasonResult.success) {
      throw CompositeValError.fromZodError(reasonResult.error);
    }

    const amountResult = z.number({ errorMap: unifyZodMessages('amount') })
      .int()
      .gt(0)
      .safeParse(amount);

    if (!amountResult.success) {
      throw CompositeValError.fromZodError(amountResult.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    return other != null && this.userUid === other.userUid &&
      this.reason === other.reason && this.amount === other.amount;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isClassOf(target: any): target is PointLossLog {
    return target != null &&
      target.userUid != null && target.userUid !== '' &&
      target.reason != null && PointLossReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}
