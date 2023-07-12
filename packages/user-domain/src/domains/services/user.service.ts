import { IUserCommand } from '@hexa/user-domain/domains/repositories/commands/user.command.ts';
import { IUserQuery } from '@hexa/user-domain/domains/repositories/queries/user.query.ts';
import { Enum } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { GainReason, PointGainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo.ts';
import { LossReason, PointLossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo.ts';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo.ts';

export class UserService {
  constructor(
    private readonly userAggQuery: IUserQuery,
    private readonly userAggCommand: IUserCommand,
  ) {
  }

  public async deposit(userAgg: UserAgg, reason: Enum<typeof PointGainReason>, amount: number) {
    const log = await this.userAggCommand.createPointLog({
      userUid: userAgg.user.uid,
      amount: new Amount(amount),
      reason: new GainReason(reason),
    });
    await this.userAggCommand.updateBalanceStat(log.amount, log.reason);
    userAgg.deposit(log);
  }

  public async withdraw(userAgg: UserAgg, reason: Enum<typeof PointLossReason>, amount: number) {
    const log = await this.userAggCommand.createPointLog({
      userUid: userAgg.user.uid,
      amount: new Amount(amount),
      reason: new LossReason(reason),
    });
    await this.userAggCommand.updateBalanceStat(log.amount, log.reason);
    userAgg.withdraw(log);
  }
}
