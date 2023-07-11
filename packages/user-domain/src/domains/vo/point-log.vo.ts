import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PickType } from '@hexa/common/types.ts';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { UndefOrNullVarError } from '@hexa/common/errors/vo.ts';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { GainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo.ts';
import { CreatedAt } from '@hexa/user-domain/domains/vo/created-at.vo.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';
import { LossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo.ts';

export interface IPointLog extends Equality {
  userUid: PickType<User, 'uid'>,
  amount: Amount,
}

// noinspection JSUnusedGlobalSymbols
@AssertStaticInterface<ClassOf<PointGainLog>>()
@AssertStaticInterface<Validatable>()
export class PointGainLog implements IPointLog {
  constructor(
    public readonly userUid: PickType<User, 'uid'>,
    public readonly reason: GainReason,
    public readonly amount: Amount,
    public readonly createdAt: CreatedAt,
  ) {
    PointGainLog.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other?.createdAt == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.userUid.equals(other.userUid) &&
      this.reason.equals(other.reason) && this.amount.equals(other.amount) &&
      this.createdAt.equals(other.createdAt);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isClassOf(target: unknown): target is PointGainLog {
    try {
      PointGainLog.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullVarError('PointGainLog');
    }

    const assumed = target as PointGainLog;

    UlidUid.validate(assumed.userUid);
    GainReason.validate(assumed.reason);
    Amount.validate(assumed.amount);
    CreatedAt.validate(assumed.createdAt);
  }
}

// noinspection JSUnusedGlobalSymbols
@AssertStaticInterface<ClassOf<PointLossLog>>()
@AssertStaticInterface<Validatable>()
export class PointLossLog implements IPointLog {
  constructor(
    public readonly userUid: PickType<User, 'uid'>,
    public readonly reason: LossReason,
    public readonly amount: Amount,
    public readonly createdAt: CreatedAt,
  ) {
    PointLossLog.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other?.createdAt == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.userUid.equals(other.userUid) && this.reason.equals(other.reason) &&
      this.amount.equals(other.amount) && this.createdAt.equals(other.createdAt);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isClassOf(target: unknown): target is PointLossLog {
    try {
      PointLossLog.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('PointLossLog');
    }

    const assumed = target as PointLossLog;

    UlidUid.validate(assumed.userUid);
    LossReason.validate(assumed.reason);
    Amount.validate(assumed.amount);
    CreatedAt.validate(assumed.createdAt);
  }
}
