import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import {
  IPointGainLog, IPointLog,
  IPointLossLog,
  PointGainReason,
  PointLossReason,
} from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum, PartialExcept, PickAndType } from '@hexa/common/types.ts';
import { IUserCommand } from '@hexa/user-domain/ports/out/commands/user.command.ts';
import { IUserAggCommand } from '../../ports/out/commands/user-agg.command';
import { IUserAggQuery, PointLogOptions } from '../../ports/out/queries/user-agg.query';
import { isValidOfEnum } from '@hexa/common/utils.ts';

class InMemoryUser implements IUser {
  constructor(
    public readonly uid: string,
    public readonly id: string,
    public readonly password: string,
    public readonly name: string,
    public readonly balance: number,
  ) {
  }
}

class InMemoryPointGainLog extends IPointGainLog<InMemoryUser> {
  constructor(
    public readonly userId: PickAndType<InMemoryUser, 'uid'>,
    public readonly reason: Enum<typeof PointGainReason>,
    public readonly amount: number,
  ) {
    super(userId, reason, amount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static is(target: any): target is InMemoryPointGainLog {
    return target != null &&
      target.userId != null && target.userId !== '' &&
      target.reason != null && PointGainReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}

class InMemoryPointLossLog extends IPointLossLog<InMemoryUser> {
  constructor(
    public readonly userId: PickAndType<InMemoryUser, 'uid'>,
    public readonly reason: Enum<typeof PointLossReason>,
    public readonly amount: number,
  ) {
    super(userId, reason, amount);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static is(target: any): target is InMemoryPointLossLog {
    return target != null &&
      target.userId != null && target.userId !== '' &&
      target.reason != null && PointLossReason.indexOf(target.reason) > -1 &&
      target.amount != null && !isNaN(Number(target.amount)) && target.amount > 0;
  }
}

class InMemoryUserCommandRepo implements IUserCommand<InMemoryUser> {
  private readonly users: Map<PickAndType<InMemoryUser, 'uid'>, InMemoryUser>;

  constructor(
    defaultUsers: [PickAndType<InMemoryUser, 'uid'>, InMemoryUser][] = [],
  ) {
    this.users = new Map<PickAndType<InMemoryUser, 'uid'>, InMemoryUser>(defaultUsers);
  }

  public async create(user: Omit<InMemoryUser, 'uid'>) {
    if (Array.from(this.users.values()).findIndex(existedUser => existedUser.id === user.id) > -1) {
      throw new Error('user id is duplicated');
    }

    const createdUser = new InMemoryUser(
      user.id,
      user.id,
      user.password,
      user.name,
      user.balance,
    );

    this.users.set(createdUser.uid, createdUser);

    return createdUser;
  }

  public async delete(userUid: PickAndType<InMemoryUser, 'uid'>): Promise<void> {
    if (!this.users.delete(userUid)) {
      throw new Error('user not found');
    }
  }

  public async update(user: PartialExcept<InMemoryUser, 'uid' | 'id'>): Promise<void> {
    const existedUser = this.users.get(user.uid);

    if (existedUser == null) {
      throw new Error('user not found');
    }

    this.users.set(user.uid, new InMemoryUser(
      user.uid,
      user.id,
      user.password ?? existedUser.password,
      user.name ?? existedUser.password,
      user.balance ?? existedUser.balance,
    ));
  }
}

class InMemoryStatCommandRepo implements IUserAggCommand<InMemoryUser>,
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

  public async createPointLog(userUid: PickAndType<InMemoryUser, 'uid'>, reason: Enum<typeof PointGainReason | typeof PointLossReason>, balance: number): Promise<void> {
    const userPointLogs = this.pointLogs.get(userUid) ?? [];

    if (isValidOfEnum(PointGainReason, reason)) {
      userPointLogs.push(new InMemoryPointGainLog(userUid, reason, balance));
    } else {
      userPointLogs.push(new InMemoryPointLossLog(userUid, reason, balance));
    }

    this.pointLogs.set(userUid, userPointLogs);
  }

  public async readPointGainLogs(
    userId: PickAndType<InMemoryUser, 'id'>,
    options?: PointLogOptions,
  ): Promise<InMemoryPointGainLog[]> {
    const userPointLogs = this.pointLogs.get(userId);
    if (userPointLogs == null) {
      return [];
    }

    const filteredLogs = userPointLogs
      .filter(log => InMemoryPointGainLog.is(log))
      .map(log => log as InMemoryPointGainLog);

    if (options?.searchOption == null) {
      return filteredLogs;
    }

    return filteredLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
  }

  public async readPointLogs(
    userId: PickAndType<InMemoryUser, 'id'>,
    options?: PointLogOptions,
  ): Promise<IPointLog<InMemoryUser>[]> {
    const userPointLogs = this.pointLogs.get(userId) ?? [];

    if (options?.searchOption == null) {
      return userPointLogs;
    }

    return userPointLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
  }

  public async readPointLossLogs(
    userId: PickAndType<InMemoryUser, 'id'>,
    options?: PointLogOptions,
  ): Promise<InMemoryPointLossLog[]> {
    const userPointLogs = this.pointLogs.get(userId);
    if (userPointLogs == null) {
      return [];
    }

    const filteredLogs = userPointLogs
      .filter(log => InMemoryPointLossLog.is(log))
      .map(log => log as InMemoryPointLossLog);

    if (options?.searchOption == null) {
      return filteredLogs;
    }

    return filteredLogs.slice(options?.offset, (options?.offset ?? 0) + (options?.amount ?? 10));
  }
}

describe('', () => {

});
