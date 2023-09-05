import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';
import { User } from '@hexa/user-stat-context/domains/entities/user.entity';
import { UlidUid } from '@hexa/user-stat-context/domains/vo/ulid-uid.vo';
import { PointGainLog, PointLossLog } from '@hexa/user-stat-context/domains/vo/point-log.vo';
import { GainReason } from '@hexa/user-stat-context/domains/vo/gain-reason.vo';
import { Amount } from '@hexa/user-stat-context/domains/vo/amount.vo';
import { CreatedAt } from '@hexa/user-stat-context/domains/vo/created-at.vo';
import { LossReason } from '@hexa/user-stat-context/domains/vo/loss-reason.vo';

describe('user-stat-context aggregate test', () => {
  it('should add deposit log', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
      ),
      [],
    );

    expect(userAgg.pointLogs).toHaveLength(0);

    const log = new PointGainLog(
      userAgg.user.uid,
      new GainReason('gained_by_admin'),
      new Amount(10),
      CreatedAt.create(),
    );
    userAgg.addPointLog(log);

    expect(userAgg.pointLogs).toHaveLength(1);
    expect(userAgg.pointLogs[0].amount.amount).toStrictEqual(log.amount.amount);
  });

  it('should add withdraw log', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
      ),
      [],
    );

    expect(userAgg.pointLogs).toHaveLength(0);

    const log = new PointLossLog(
      userAgg.user.uid,
      new LossReason('lost_by_admin'),
      new Amount(10),
      CreatedAt.create(),
    );
    userAgg.addPointLog(log);

    expect(userAgg.pointLogs).toHaveLength(1);
    expect(userAgg.pointLogs[0].amount.amount).toStrictEqual(log.amount.amount);
  });
});
