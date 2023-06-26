import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
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

export interface IPointLog<T extends IUser> extends Equality {
  userUid: PickAndType<T, 'uid'>,
  amount: number,
}

// noinspection JSUnusedGlobalSymbols
@AssertStaticInterface<ClassOf<PointGainLog<IUser>>>()
export class PointGainLog<T extends IUser> implements IPointLog<T> {
  constructor(
    public readonly userUid: PickAndType<T, 'uid'>,
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
  public static isClassOf<T extends IUser>(target: any): target is PointGainLog<T> {
    return target != null &&
      target.userId != null && target.userId !== '' &&
      target.reason != null && PointGainReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}

// noinspection JSUnusedGlobalSymbols
@AssertStaticInterface<ClassOf<PointLossLog<IUser>>>()
export class PointLossLog<T extends IUser> implements IPointLog<T> {
  constructor(
    public readonly userUid: PickAndType<T, 'uid'>,
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
  public static isClassOf<T extends IUser>(target: any): target is PointLossLog<T> {
    return target != null &&
      target.userId != null && target.userId !== '' &&
      target.reason != null && PointLossReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}
