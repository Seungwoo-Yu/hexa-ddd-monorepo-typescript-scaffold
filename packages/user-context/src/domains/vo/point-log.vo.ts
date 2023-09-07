import { User } from '@hexa/user-context/domains/entities/user.entity';
import { PickType } from '@hexa/common/types';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { UndefOrNullVarError } from '@hexa/common/errors/vo';
import { Amount } from '@hexa/user-context/domains/vo/amount.vo';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { GainReason } from '@hexa/user-context/domains/vo/gain-reason.vo';
import { CreatedAt } from '@hexa/user-context/domains/vo/created-at.vo';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';
import { LossReason } from '@hexa/user-context/domains/vo/loss-reason.vo';

export interface IPointLog extends Equality {
  userUid: PickType<User, 'uid'>,
  amount: Amount,
  createdAt: CreatedAt,
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
