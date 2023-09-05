import { IPointLog, PointGainLog, PointLossLog } from '@hexa/user-stat-context/domains/vo/point-log.vo';
import { PickType } from '@hexa/common/types';
import { User } from '@hexa/user-stat-context/domains/entities/user.entity';
import { GainReason } from '@hexa/user-stat-context/domains/vo/gain-reason.vo';
import { Amount } from '@hexa/user-stat-context/domains/vo/amount.vo';
import { CreatedAt } from '@hexa/user-stat-context/domains/vo/created-at.vo';
import { LossReason } from '@hexa/user-stat-context/domains/vo/loss-reason.vo';
import { IUserCommand } from '@hexa/user-stat-context/domains/repositories/commands/user.command';
import { IUserQuery, PointLogOptions } from '@hexa/user-stat-context/domains/repositories/queries/user.query';
import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';

export class InMemoryPointGainLog extends PointGainLog {
  constructor(
    public readonly index: number,
    public readonly userUid: PickType<User, 'uid'>,
    public readonly reason: GainReason,
    public readonly amount: Amount,
    public readonly createdAt: CreatedAt,
  ) {
    super(userUid, reason, amount, createdAt);
  }
}

export class InMemoryPointLossLog extends PointLossLog {
  constructor(
    public readonly index: number,
    public readonly userUid: PickType<User, 'uid'>,
    public readonly reason: LossReason,
    public readonly amount: Amount,
    public readonly createdAt: CreatedAt,
  ) {
    super(userUid, reason, amount, createdAt);
  }
}

export class InMemoryUserRepo implements IUserCommand, IUserQuery {
  private totalBalance = 0;
  private increment = 0;
  private readonly uidToIndexMap: Map<PickType<User, 'uid'>, number>;
  private readonly users: Map<number, UserAgg>;

  constructor(
    defaultUsers: UserAgg[] = [],
  ) {
    this.users = new Map(defaultUsers.map(userAgg => {
      return [this.increment++, new UserAgg(userAgg.user, [...userAgg.pointLogs])];
    }));
    const entries = Array.from(this.users.entries());
    this.uidToIndexMap = new Map(entries.map(([index, userAgg]) => [userAgg.user.uid, index]));
    entries.forEach(([_, agg]) => {
      agg.pointLogs.forEach(log => {
        if (PointGainLog.isClassOf(log)) {
          this.totalBalance += log.amount.amount;
        }

        if (PointLossLog.isClassOf(log)) {
          this.totalBalance -= log.amount.amount;
        }
      });
    });
  }

  public async updateBalanceStat(amount: Amount, reason: GainReason | LossReason) {
    if (GainReason.isClassOf(reason)) {
      this.totalBalance += amount.amount;
    } else {
      this.totalBalance -= amount.amount;
    }
  }

  public getStat() {
    return this.totalBalance;
  }

  private async readPointGainLogs(
    userUid: PickType<User, 'uid'>,
    options?: PointLogOptions & {
      searchOption: Exclude<PickType<PointLogOptions, 'searchOption'>, 'none'>,
    },
  ): Promise<InMemoryPointGainLog[]> {
    const userIdx = this.uidToIndexMap.get(userUid);
    if (userIdx == null) {
      throw new Error('user not found');
    }

    const userAgg = this.users.get(userIdx);
    if (userAgg == null) {
      throw new Error('user not found');
    }

    const filteredLogs = userAgg.pointLogs
      .filter(log => PointGainLog.isClassOf(log)) as InMemoryPointGainLog[];

    if (options?.searchOption == null) {
      return filteredLogs.slice(undefined, options?.amount);
    }

    if (options.searchOption === 'offset') {
      return filteredLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
    }

    const startIdx = filteredLogs.findIndex(log => {
      return log.index === options.cursor;
    });

    return startIdx > -1
      ? filteredLogs.slice(startIdx, startIdx + (options?.amount ?? 10))
      : filteredLogs.slice(undefined, (options?.amount ?? 10));
  }

  private async readPointLogs(
    userUid: PickType<User, 'uid'>,
    options?: PointLogOptions & {
      searchOption: Exclude<PickType<PointLogOptions, 'searchOption'>, 'none'>,
    },
  ): Promise<IPointLog[]> {
    const userIdx = this.uidToIndexMap.get(userUid);
    if (userIdx == null) {
      throw new Error('user not found');
    }

    const user = this.users.get(userIdx);
    if (user == null) {
      throw new Error('user not found');
    }

    const castedLogs = user.pointLogs as (InMemoryPointGainLog | InMemoryPointLossLog)[];

    if (options?.searchOption == null) {
      return castedLogs.slice(undefined, options?.amount);
    }

    if (options.searchOption === 'offset') {
      return castedLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
    }

    const startIdx = castedLogs.findIndex(log => {
      return log.index === options.cursor;
    });

    return startIdx > -1
      ? castedLogs.slice(startIdx, startIdx + (options?.amount ?? 10))
      : castedLogs.slice(undefined, (options?.amount ?? 10));
  }

  private async readPointLossLogs(
    userUid: PickType<User, 'uid'>,
    options?: PointLogOptions & {
      searchOption: Exclude<PickType<PointLogOptions, 'searchOption'>, 'none'>,
    },
  ): Promise<InMemoryPointLossLog[]> {
    const userIdx = this.uidToIndexMap.get(userUid);
    if (userIdx == null) {
      throw new Error('user not found');
    }

    const user = this.users.get(userIdx);
    if (user == null) {
      throw new Error('user not found');
    }

    const filteredLogs = user.pointLogs
      .filter(log => PointLossLog.isClassOf(log)) as InMemoryPointLossLog[];

    if (options?.searchOption == null) {
      return filteredLogs.slice(undefined, options?.amount);
    }

    if (options.searchOption === 'offset') {
      return filteredLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
    }

    const startIdx = filteredLogs.findIndex(log => {
      return log.index === options.cursor;
    });

    return startIdx > -1
      ? filteredLogs.slice(startIdx, startIdx + (options?.amount ?? 10))
      : filteredLogs.slice(undefined, (options?.amount ?? 10));
  }

  public async readByUid(
    uid: PickType<User, 'uid'>,
    options?: PointLogOptions,
  ): Promise<UserAgg> {
    const index = this.uidToIndexMap.get(uid);
    if (index == null) {
      throw new Error('user not found');
    }

    const userAgg = this.users.get(index);
    if (userAgg == null) {
      throw new Error('user not found');
    }

    if (options != null) {
      if (options.searchOption == null || options.searchOption === 'none') {
        return new UserAgg(userAgg.user, []);
      } else if (options.filteredBy === 'gain') {
        return new UserAgg(
          userAgg.user,
          await this.readPointGainLogs(userAgg.user.uid, options),
        );
      } else if (options.filteredBy === 'loss') {
        return new UserAgg(
          userAgg.user,
          await this.readPointLossLogs(userAgg.user.uid, options),
        );
      }
    }

    return new UserAgg(
      userAgg.user,
      await this.readPointLogs(userAgg.user.uid, options),
    );
  }

  public async updateUser(userAgg: UserAgg): Promise<void> {
    const userIdx = this.uidToIndexMap.get(userAgg.user.uid);
    if (userIdx == null) {
      throw new Error('user not found');
    }

    this.users.set(userIdx, new UserAgg(userAgg.user, [...userAgg.pointLogs]));
  }
}
