import { IUserCommand } from '@hexa/user-domain/domains/repositories/commands/user.command.ts';
import { IUserQuery } from '@hexa/user-domain/domains/repositories/queries/user.query.ts';
import { PointGainLog, PointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { PointGainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo.ts';
import { PointLossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo.ts';

export class UserService {
  constructor(
    private readonly userAggQuery: IUserQuery,
    private readonly userAggCommand: IUserCommand,
  ) {
  }

  public async deposit(userAgg: UserAgg, reason: Enum<typeof PointGainReason>, amount: number) {
    userAgg.deposit(reason, amount);
    const log = userAgg.pointLogs[userAgg.pointLogs.length - 1] as PointGainLog;
    await this.userAggCommand.createPointLog(log);
    await this.userAggCommand.updateBalanceStat(log.amount, log.reason);
  }

  public async withdraw(userAgg: UserAgg, reason: Enum<typeof PointLossReason>, amount: number) {
    userAgg.withdraw(reason, amount);
    const log = userAgg.pointLogs[userAgg.pointLogs.length - 1] as PointLossLog;
    await this.userAggCommand.createPointLog(log);
    await this.userAggCommand.updateBalanceStat(log.amount, log.reason);
  }
}
