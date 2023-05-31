import { IUserAggCommand } from '@hexa/user-domain/ports/out/commands/user-agg.command.ts';
import { IUserAggQuery, PointLogOptions } from '@hexa/user-domain/ports/out/queries/user-agg.query.ts';
import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import {
  IPointGainLog,
  IPointLog,
  IPointLossLog,
  PointGainReason,
  PointLossReason,
} from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum, PartialExcept, PickAndType } from '@hexa/common/types.ts';
import { isValidOfEnum } from '@hexa/common/utils.ts';
import { IUserCommand } from '@hexa/user-domain/ports/out/commands/user.command.ts';

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

describe('user-domain aggregate test', () => {
  it('should deposit positive amount', async () => {
    const repo = new InMemoryStatCommandRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    expect(userAgg.user.balance).toEqual(10);
    expect(await repo.getStat()).toEqual(10);

    await userAgg.deposit('gained_by_admin', 10);

    expect(userAgg.user.balance).toEqual(20);
    expect(await repo.getStat()).toEqual(20);
  });

  it('should deposit add negative amount', async () => {
    const repo = new InMemoryStatCommandRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await expect(userAgg.deposit('gained_by_admin', -10))
      .rejects.toThrowError('amount must be more than 0');
  });

  it('should withdraw positive amount', async () => {
    const repo = new InMemoryStatCommandRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await userAgg.withdraw('lost_by_admin', 10);

    expect(userAgg.user.balance).toEqual(0);
    expect(await repo.getStat()).toEqual(0);
  });

  it('should not withdraw negative amount', async () => {
    const repo = new InMemoryStatCommandRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await expect(userAgg.withdraw('lost_by_admin', -10))
      .rejects.toThrowError('amount must be more than 0');
  });

  it('should not withdraw more than current balance', async () => {
    const repo = new InMemoryStatCommandRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await expect(userAgg.withdraw('lost_by_admin', 20))
      .rejects.toThrowError('funds cannot be less than 0');
  });
});
