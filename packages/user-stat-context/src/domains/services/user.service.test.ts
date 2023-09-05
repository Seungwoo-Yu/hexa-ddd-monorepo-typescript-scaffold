import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';
import { User } from '@hexa/user-stat-context/domains/entities/user.entity';
import { UlidUid } from '@hexa/user-stat-context/domains/vo/ulid-uid.vo';
import { UserService } from '@hexa/user-stat-context/domains/services/user.service';
import { InMemoryUserRepo } from '@hexa/user-stat-context/tests/mocks';

describe('user-domain service test', () => {
  it('should add deposit log', async () => {
    const userAgg = new UserAgg(
      new User(UlidUid.create()),
      [],
    );
    const repo = new InMemoryUserRepo([userAgg]);
    const service = new UserService(repo);

    expect(repo.getStat()).toStrictEqual(0);

    await service.addPointLog(userAgg, 'gained_by_admin', 20);

    expect(repo.getStat()).toStrictEqual(20);

    await repo.updateUser(userAgg);

    const loadedUserAgg = await repo.readByUid(userAgg.user.uid);
    expect(loadedUserAgg.pointLogs.length).toStrictEqual(1);
  });

  it('should add withdraw log', async () => {
    const userAgg = new UserAgg(
      new User(UlidUid.create()),
      [],
    );
    const repo = new InMemoryUserRepo([userAgg]);
    const service = new UserService(repo);

    await service.addPointLog(userAgg, 'gained_by_admin', 20);

    expect(repo.getStat()).toStrictEqual(20);

    await service.addPointLog(userAgg, 'lost_by_admin', 20);

    expect(repo.getStat()).toStrictEqual(0);

    await repo.updateUser(userAgg);

    const loadedUserAgg = await repo.readByUid(userAgg.user.uid);
    expect(loadedUserAgg.pointLogs.length).toStrictEqual(2);
  });
});
