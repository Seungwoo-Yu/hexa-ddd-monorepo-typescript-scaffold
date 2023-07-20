import { InMemoryUserRepo } from '@hexa/user-domain/tests/mocks';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo';
import { Name } from '@hexa/user-domain/domains/vo/name.vo';
import { Balance } from '@hexa/user-domain/domains/vo/balance.vo';
import { UserService } from '@hexa/user-domain/domains/services/user.service';
import { User } from '@hexa/user-domain/domains/entities/user.entity';

describe('user-domain service test', () => {
  it('should deposit', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(0),
      ),
      [],
    );
    const repo = new InMemoryUserRepo([userAgg.user], []);
    const service = new UserService(repo, repo);

    expect(repo.getStat()).toStrictEqual(0);

    await service.deposit(userAgg, 'gained_by_admin', 20);

    expect(repo.getStat()).toStrictEqual(20);

    const loadedUserAgg = await repo.readByUid(userAgg.user.uid);
    expect(loadedUserAgg.user.balance.amount).toStrictEqual(20);
    expect(loadedUserAgg.pointLogs.length).toStrictEqual(1);
  });

  it('should withdraw', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(0),
      ),
      [],
    );
    const repo = new InMemoryUserRepo([userAgg.user], []);
    const service = new UserService(repo, repo);

    await service.deposit(userAgg, 'gained_by_admin', 20);

    expect(repo.getStat()).toStrictEqual(20);

    await service.withdraw(userAgg, 'lost_by_admin', 20);

    expect(repo.getStat()).toStrictEqual(0);

    const loadedUserAgg = await repo.readByUid(userAgg.user.uid);
    expect(loadedUserAgg.user.balance.amount).toStrictEqual(0);
    expect(loadedUserAgg.pointLogs.length).toStrictEqual(2);
  });
});
