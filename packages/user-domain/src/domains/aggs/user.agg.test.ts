import { InMemoryUserAggRepo, InMemoryUser } from '@hexa/user-domain/tests/mocks.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { Balance } from '@hexa/user-domain/domains/vo/balance.vo.ts';

describe('user-domain aggregate test', () => {
  it('should deposit positive amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
    );

    expect(userAgg.user.balance.amount).toEqual(10);
    expect(await repo.getStat()).toEqual(10);

    await userAgg.deposit('gained_by_admin', 10);

    expect(userAgg.user.balance.amount).toEqual(20);
    expect(await repo.getStat()).toEqual(20);
  });

  it('should not deposit add negative amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
    );

    await expect(userAgg.deposit('gained_by_admin', -10))
      .rejects.toThrowError('composite validation error: 1 error(s) thrown.\n' +
        'main error: amount must be greater than 0');
  });

  it('should withdraw positive amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
    );

    await userAgg.withdraw('lost_by_admin', 10);

    expect(userAgg.user.balance.amount).toEqual(0);
    expect(await repo.getStat()).toEqual(0);
  });

  it('should not withdraw negative amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
    );

    await expect(userAgg.withdraw('lost_by_admin', -10))
      .rejects.toThrowError('composite validation error: 1 error(s) thrown.\n' +
        'main error: amount must be greater than 0');
  });

  it('should not withdraw more than current balance', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
    );

    await expect(userAgg.withdraw('lost_by_admin', 20))
      .rejects.toThrowError('composite validation error: 1 error(s) thrown.\n' +
        'main error: amount must be less than 10');
  });
});
