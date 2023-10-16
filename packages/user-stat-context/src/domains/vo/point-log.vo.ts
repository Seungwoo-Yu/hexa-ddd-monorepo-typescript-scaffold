import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { PickType } from '@hexa/common/types';
import { Amount } from '@hexa/user-stat-context/domains/vo/amount.vo';
import { CreatedAt } from '@hexa/user-stat-context/domains/vo/created-at.vo';
import { User } from '@hexa/user-stat-context/domains/entities/user.entity';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { GainReason } from '@hexa/user-stat-context/domains/vo/gain-reason.vo';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { UndefOrNullVarError } from '@hexa/common/errors/vo';
import { UlidUid } from '@hexa/user-stat-context/domains/vo/ulid-uid.vo';
import { LossReason } from '@hexa/user-stat-context/domains/vo/loss-reason.vo';

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

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as PointGainLog;

    return this.userUid.equals(expected.userUid) &&
      this.reason.equals(expected.reason) &&
      this.amount.equals(expected.amount) &&
      this.createdAt.equals(expected.createdAt);
  }

  public static isClassOf(target: unknown): target is PointGainLog {
    try {
      PointGainLog.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullVarError('PointGainLog');
    }
    const expected = target as PointGainLog;

    UlidUid.validate(expected.userUid);
    GainReason.validate(expected.reason);
    Amount.validate(expected.amount);
    CreatedAt.validate(expected.createdAt);
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

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as PointLossLog;

    return this.userUid.equals(expected.userUid) &&
      this.reason.equals(expected.reason) &&
      this.amount.equals(expected.amount) &&
      this.createdAt.equals(expected.createdAt);
  }

  public static isClassOf(target: unknown): target is PointLossLog {
    try {
      PointLossLog.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('PointLossLog');
    }
    const expected = target as PointLossLog;

    UlidUid.validate(expected.userUid);
    LossReason.validate(expected.reason);
    Amount.validate(expected.amount);
    CreatedAt.validate(expected.createdAt);
  }
}
