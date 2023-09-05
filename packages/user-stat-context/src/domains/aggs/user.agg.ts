import { User } from '@hexa/user-stat-context/domains/entities/user.entity';
import { IPointLog, PointGainLog, PointLossLog } from '@hexa/user-stat-context/domains/vo/point-log.vo';

export class UserAgg {
  constructor(
    public readonly user: User,
    public readonly pointLogs: IPointLog[],
  ) {}

  public addPointLog(log: PointGainLog | PointLossLog) {
    this.pointLogs.push(log);
  }
}
