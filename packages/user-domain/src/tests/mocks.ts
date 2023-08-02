import { User } from '@hexa/user-domain/domains/entities/user.entity';
import { IPointLog, PointLossLog, PointGainLog } from '@hexa/user-domain/domains/vo/point-log.vo';
import { OmitFuncs, PickType } from '@hexa/common/types';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo';
import { IUserCommand } from '@hexa/user-domain/domains/repositories/commands/user.command';
import { IUserQuery, PointLogOptions } from '@hexa/user-domain/domains/repositories/queries/user.query';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo';
import { GainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo';
import { LossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo';
import { CreatedAt } from '@hexa/user-domain/domains/vo/created-at.vo';

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
  private readonly idToIndexMap: Map<PickType<PickType<User, 'credential'>, 'id'>, number>;
  private readonly users: Map<number, User>;
  private readonly pointLogs: Map<PickType<User, 'uid'>, IPointLog[]>;

  constructor(
    private readonly defaultUsers: User[] = [],
    private readonly defaultPointLogs: [PickType<User, 'uid'>, IPointLog[]][] = [],
  ) {
    this.users = new Map(defaultUsers.map(user => [this.increment++, user]));
    const entries = Array.from(this.users.entries());
    this.uidToIndexMap = new Map(entries.map(([index, user]) => [user.uid, index]));
    this.idToIndexMap = new Map(entries.map(([index, user]) => [user.credential.id, index]));
    this.pointLogs = new Map(defaultPointLogs);
    defaultPointLogs.forEach(([_, logs]) => {
      logs.forEach(log => {
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

  public async createPointLog(log: Omit<OmitFuncs<PointGainLog>, 'createdAt'>): Promise<PointGainLog>;
  public async createPointLog(log: Omit<OmitFuncs<PointLossLog>, 'createdAt'>): Promise<PointLossLog>;
  public async createPointLog(
    _log: Omit<OmitFuncs<PointGainLog | PointLossLog>, 'createdAt'>,
  ): Promise<PointGainLog | PointLossLog> {
    const log =
      GainReason.isClassOf(_log.reason)
        ? new PointGainLog(
          _log.userUid,
          _log.reason,
          _log.amount,
          CreatedAt.create(),
        )
        : new PointLossLog(
          _log.userUid,
          _log.reason,
          _log.amount,
          CreatedAt.create(),
        );
    const userPointLogs = this.pointLogs.get(log.userUid) ?? [];

    userPointLogs.push(log);
    this.pointLogs.set(log.userUid, userPointLogs);

    return log;
  }

  private async readPointGainLogs(
    userUid: PickType<User, 'uid'>,
    options?: PointLogOptions & {
      searchOption: Exclude<PickType<PointLogOptions, 'searchOption'>, 'none'>,
    },
  ): Promise<InMemoryPointGainLog[]> {
    const userPointLogs = this.pointLogs.get(userUid);
    if (userPointLogs == null) {
      return [];
    }

    const filteredLogs = userPointLogs
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
    const userPointLogs = this.pointLogs.get(userUid);
    if (userPointLogs == null) {
      return [];
    }

    const castedLogs = userPointLogs as (InMemoryPointGainLog | InMemoryPointLossLog)[];

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
    const userPointLogs = this.pointLogs.get(userUid);
    if (userPointLogs == null) {
      return [];
    }

    const filteredLogs = userPointLogs
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

  public async createUser(user: Omit<User, 'uid'>) {
    if (this.idToIndexMap.has(user.credential.id)) {
      throw new Error('user id is duplicated');
    }

    const createdUser = new User(
      UlidUid.create(),
      user.credential,
      user.name,
      user.balance,
    );

    this.users.set(this.increment++, createdUser);
    this.uidToIndexMap.set(createdUser.uid, this.increment);
    this.idToIndexMap.set(createdUser.credential.id, this.increment);

    return createdUser.uid;
  }

  public deleteUser(userUid: PickType<User, 'uid'>): Promise<void> {
    const index = this.uidToIndexMap.get(userUid);
    if (index == null) {
      throw new Error('user not found');
    }

    const user = this.users.get(index);
    if (user == null) {
      throw new Error('user not found');
    }

    this.users.delete(index);
    this.uidToIndexMap.delete(user.uid);
    this.idToIndexMap.delete(user.credential.id);
    return Promise.resolve(undefined);
  }

  public async exists(uid: PickType<User, 'uid'>): Promise<boolean> {
    return this.uidToIndexMap.has(uid);
  }

  public async readByUid(
    uid: PickType<User, 'uid'>,
    options?: PointLogOptions,
  ): Promise<UserAgg> {
    const index = this.uidToIndexMap.get(uid);
    if (index == null) {
      throw new Error('user not found');
    }

    const user = this.users.get(index);
    if (user == null) {
      throw new Error('user not found');
    }

    if (options != null) {
      if (options.searchOption == null || options.searchOption === 'none') {
        return new UserAgg(user, []);
      } else if (options.filteredBy === 'gain') {
        return new UserAgg(
          user,
          await this.readPointGainLogs(user.uid, options),
        );
      } else if (options.filteredBy === 'loss') {
        return new UserAgg(
          user,
          await this.readPointLossLogs(user.uid, options),
        );
      }
    }

    return new UserAgg(
      user,
      await this.readPointLogs(user.uid, options),
    );
  }

  public async updateUser(userAgg: UserAgg): Promise<void> {
    const userIdx = this.uidToIndexMap.get(userAgg.user.uid);
    if (userIdx == null) {
      throw new Error('user not found');
    }

    this.users.set(userIdx, userAgg.user);

    const prvUserPntLogs = (this.pointLogs.get(userAgg.user.uid) ?? []) as
      (InMemoryPointGainLog | InMemoryPointLossLog)[];

    const cntUserPntLogs = (userAgg.pointLogs ?? []) as
      (InMemoryPointGainLog | InMemoryPointLossLog)[];

    cntUserPntLogs.forEach(cntLog => {
      const idx = prvUserPntLogs.findIndex(prvLog => {
        return cntLog.index === prvLog.index;
      });

      if (idx > -1) {
        prvUserPntLogs[idx] = cntLog;
      }
    });
  }
}
