import { IUserCommand } from '@hexa/user-domain/domains/repositories/commands/user.command.ts';
import { IUserQuery } from '@hexa/user-domain/domains/repositories/queries/user.query.ts';
import { PointGainReason, PointLossReason } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';

export class UserService {
  constructor(
    private readonly userAggQuery: IUserQuery,
    private readonly userAggCommand: IUserCommand,
  ) {
  }

  public async deposit(userAgg: UserAgg, reason: Enum<typeof PointGainReason>, amount: number) {
    userAgg.deposit(reason, amount);
    await this.userAggCommand.createPointLog(userAgg.user.uid, reason, amount);
    await this.userAggCommand.updateBalanceStat(amount);
  }

  public async withdraw(userAgg: UserAgg, reason: Enum<typeof PointLossReason>, amount: number) {
    userAgg.withdraw(reason, amount);
    await this.userAggCommand.createPointLog(userAgg.user.uid, reason, amount);
    await this.userAggCommand.updateBalanceStat(-amount);
  }
}
