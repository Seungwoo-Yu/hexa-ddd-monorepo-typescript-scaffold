import { User } from '@hexa/user-stat-context/domains/entities/user.entity';
import { IPointLog, PointGainLog, PointLossLog } from '@hexa/user-stat-context/domains/vo/point-log.vo';
import { GainReason } from '@hexa/user-stat-context/domains/vo/gain-reason.vo';
import { LossReason } from '@hexa/user-stat-context/domains/vo/loss-reason.vo';
import { Amount } from '@hexa/user-stat-context/domains/vo/amount.vo';
import { CreatedAt } from '@hexa/user-stat-context/domains/vo/created-at.vo';

export class UserAgg {
  constructor(
    public readonly user: User,
    public readonly pointLogs: IPointLog[],
  ) {}

  public addPointLog(
    reason: GainReason | LossReason,
    amount: Amount,
  ) {
    const createdAt = CreatedAt.create();
    const log = GainReason.isClassOf(reason)
      ? new PointGainLog(this.user.uid, reason, amount, createdAt)
      : new PointLossLog(this.user.uid, reason, amount, createdAt);

    this.pointLogs.push(log);
  }
}
