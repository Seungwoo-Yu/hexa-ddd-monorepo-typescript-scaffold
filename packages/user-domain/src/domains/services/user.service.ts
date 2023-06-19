import { IUserCommand } from '@hexa/user-domain/domains/repositories/commands/user.command.ts';
import { IUserQuery } from '@hexa/user-domain/domains/repositories/queries/user.query.ts';
import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainReason, PointLossReason } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';

export class UserService<T extends IUser> {
  constructor(
    private readonly userAggQuery: IUserQuery<T>,
    private readonly userAggCommand: IUserCommand<T>,
  ) {
  }

  public async deposit(userAgg: UserAgg<T>, reason: Enum<typeof PointGainReason>, amount: number) {
    userAgg.deposit(reason, amount);
    await this.userAggCommand.createPointLog(userAgg.user.uid, reason, amount);
    await this.userAggCommand.updateBalanceStat(amount);
  }

  public async withdraw(userAgg: UserAgg<T>, reason: Enum<typeof PointLossReason>, amount: number) {
    userAgg.withdraw(reason, amount);
    await this.userAggCommand.createPointLog(userAgg.user.uid, reason, amount);
    await this.userAggCommand.updateBalanceStat(-amount);
  }
}
