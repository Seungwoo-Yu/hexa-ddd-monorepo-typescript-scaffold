import { IUserCommand } from '@hexa/user-stat-context/domains/repositories/commands/user.command';
import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';
import { Enum } from '@hexa/common/types';
import { GainReason, PointGainReason } from '@hexa/user-stat-context/domains/vo/gain-reason.vo';
import { LossReason, PointLossReason } from '@hexa/user-stat-context/domains/vo/loss-reason.vo';
import { CreatedAt } from '@hexa/user-stat-context/domains/vo/created-at.vo';
import { PointGainLog, PointLossLog } from '@hexa/user-stat-context/domains/vo/point-log.vo';
import { Amount } from '@hexa/user-stat-context/domains/vo/amount.vo';

export class UserService {
  constructor(
    private readonly userAggCommand: IUserCommand,
  ) {}

  public async addPointLog(
    userAgg: UserAgg,
    _reason: Enum<typeof PointGainReason> | Enum<typeof PointLossReason>,
    _amount: number,
  ) {
    const reason = (() => {
      try {
        return new GainReason(_reason as never);
      } catch (ignored) {
        // ignored
      }

      try {
        return new LossReason(_reason as never);
      } catch (ignored) {
        // ignored
      }

      throw new Error('reason is not valid');
    })();
    const amount = new Amount(_amount);

    await this.userAggCommand.updateBalanceStat(amount, reason);

    const createdAt = CreatedAt.create();
    const log = GainReason.isClassOf(reason)
      ? new PointGainLog(userAgg.user.uid, reason, amount, createdAt)
      : new PointLossLog(userAgg.user.uid, reason, amount, createdAt);

    userAgg.addPointLog(log);
  }
}
