import { IUserAggCommand } from '@hexa/user-domain/ports/out/commands/user-agg.command.ts';
import { IUserAggQuery, PointLogOptions } from '@hexa/user-domain/ports/out/queries/user-agg.query.ts';
import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import {
  IPointGainLog,
  IPointLog,
  IPointLossLog,
  PointGainReason,
  PointLossReason,
} from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum, PickAndType } from '@hexa/common/types.ts';
import { isValidOfEnum } from '@hexa/common/utils.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { ClassOf } from '@hexa/common/interfaces.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { Balance } from '@hexa/user-domain/domains/vo/balance.vo.ts';

export class InMemoryUser implements IUser {
  constructor(
    public readonly uid: UlidUid,
    public readonly credential: Credential,
    public readonly name: Name,
    public readonly balance: Balance,
  ) {
  }
}

@AssertStaticInterface<ClassOf<InMemoryPointGainLog>>()
export class InMemoryPointGainLog extends IPointGainLog<InMemoryUser> {
  constructor(
    public readonly userUid: PickAndType<InMemoryUser, 'uid'>,
    public readonly reason: Enum<typeof PointGainReason>,
    public readonly amount: number,
  ) {
    super(userUid, reason, amount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isClassOf(target: any): target is InMemoryPointGainLog {
    return target != null &&
      target.userId != null && target.userId !== '' &&
      target.reason != null && PointGainReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}

@AssertStaticInterface<ClassOf<InMemoryPointLossLog>>()
export class InMemoryPointLossLog extends IPointLossLog<InMemoryUser> {
  constructor(
    public readonly userUid: PickAndType<InMemoryUser, 'uid'>,
    public readonly reason: Enum<typeof PointLossReason>,
    public readonly amount: number,
  ) {
    super(userUid, reason, amount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isClassOf(target: any): target is InMemoryPointLossLog {
    return target != null &&
      target.userId != null && target.userId !== '' &&
      target.reason != null && PointLossReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}

export class InMemoryUserAggRepo implements IUserAggCommand<InMemoryUser>,
  IUserAggQuery<InMemoryUser, InMemoryPointGainLog, InMemoryPointLossLog> {
  private readonly pointLogs: Map<PickAndType<InMemoryUser, 'uid'>, IPointLog<InMemoryUser>[]>;

  constructor(
    private balance = 0,
    private readonly defaultPointLogs: [PickAndType<InMemoryUser, 'uid'>, IPointLog<InMemoryUser>[]][] = [],
  ) {
    this.pointLogs = new Map(defaultPointLogs);
  }

  public async updateBalanceStat(balance: number) {
    this.balance += balance;
  }

  public async getStat() {
    return this.balance;
  }

  public async createPointLog(
    userUid: PickAndType<InMemoryUser, 'uid'>,
    reason: Enum<typeof PointGainReason | typeof PointLossReason>,
    balance: number,
  ): Promise<void> {
    const userPointLogs = this.pointLogs.get(userUid) ?? [];

    if (isValidOfEnum(PointGainReason, reason)) {
      userPointLogs.push(new InMemoryPointGainLog(userUid, reason, balance));
    } else {
      userPointLogs.push(new InMemoryPointLossLog(userUid, reason, balance));
    }

    this.pointLogs.set(userUid, userPointLogs);
  }

  public async readPointGainLogs(
    userId: PickAndType<InMemoryUser, 'uid'>,
    options?: PointLogOptions,
  ): Promise<InMemoryPointGainLog[]> {
    const userPointLogs = this.pointLogs.get(userId);
    if (userPointLogs == null) {
      return [];
    }

    const filteredLogs = userPointLogs
      .filter(log => InMemoryPointGainLog.isClassOf(log))
      .map(log => log as InMemoryPointGainLog);

    if (options?.searchOption == null) {
      return filteredLogs;
    }

    return filteredLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
  }

  public async readPointLogs(
    userId: PickAndType<InMemoryUser, 'uid'>,
    options?: PointLogOptions,
  ): Promise<IPointLog<InMemoryUser>[]> {
    const userPointLogs = this.pointLogs.get(userId) ?? [];

    if (options?.searchOption == null) {
      return userPointLogs;
    }

    return userPointLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
  }

  public async readPointLossLogs(
    userId: PickAndType<InMemoryUser, 'uid'>,
    options?: PointLogOptions,
  ): Promise<InMemoryPointLossLog[]> {
    const userPointLogs = this.pointLogs.get(userId);
    if (userPointLogs == null) {
      return [];
    }

    const filteredLogs = userPointLogs
      .filter(log => InMemoryPointLossLog.isClassOf(log))
      .map(log => log as InMemoryPointLossLog);

    if (options?.searchOption == null) {
      return filteredLogs;
    }

    return filteredLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
  }
}
