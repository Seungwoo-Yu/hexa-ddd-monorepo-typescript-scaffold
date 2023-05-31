import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { IUserAggCommand } from '@hexa/user-domain/ports/out/commands/user-agg.command.ts';
import { IUserAggQuery, PointLogOptions } from '@hexa/user-domain/ports/out/queries/user-agg.query.ts';
import {
  IPointGainLog, IPointLog,
  IPointLossLog,
  PointGainReason,
  PointLossReason,
} from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum } from '@hexa/common/types.ts';

export class UserAgg<T extends IUser, U extends IPointGainLog<T>, V extends IPointLossLog<T>> {
  constructor(
    private readonly userAggQuery: IUserAggQuery<T, U, V>,
    private readonly userAggCommand: IUserAggCommand<T>,
    public readonly user: T,
  ) {}

  public async deposit(reason: Enum<typeof PointGainReason>, amount: number) {
    if (amount < 0) {
      throw new RangeError('amount must be more than 0');
    }

    const result = this.user.balance + amount;
    if (result < 0) {
      throw new RangeError('funds cannot be less than 0');
    }

    await this.userAggCommand.createPointLog(this.user.id, reason, amount);
    await this.userAggCommand.updateBalanceStat(amount);
    this.user.balance = result;
  }

  public async withdraw(reason: Enum<typeof PointLossReason>, amount: number) {
    if (amount < 0) {
      throw new RangeError('amount must be more than 0');
    }

    const result = this.user.balance - amount;
    if (result < 0) {
      throw new RangeError('funds cannot be less than 0');
    }

    await this.userAggCommand.createPointLog(this.user.id, reason, amount);
    await this.userAggCommand.updateBalanceStat(-amount);
    this.user.balance = result;
  }

  public async readPointLogs(options?: PointLogOptions): Promise<IPointLog<T>[]> {
    return this.userAggQuery.readPointLogs(this.user.id, options);
  }

  public async readPointGainLogs(options?: PointLogOptions): Promise<U[]> {
    return this.userAggQuery.readPointGainLogs(this.user.id, options);
  }

  public async readPointLossLogs(options?: PointLogOptions): Promise<V[]> {
    return this.userAggQuery.readPointLossLogs(this.user.id, options);
  }
}
