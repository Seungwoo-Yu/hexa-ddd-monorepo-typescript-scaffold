import { IUserCommand } from '@hexa/user-domain/domains/repositories/commands/user.command';
import { IUserQuery } from '@hexa/user-domain/domains/repositories/queries/user.query';
import { Enum } from '@hexa/common/types';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg';
import { GainReason, PointGainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo';
import { LossReason, PointLossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo';

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
