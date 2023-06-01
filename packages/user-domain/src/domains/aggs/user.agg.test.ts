import { InMemoryUserAggRepo, InMemoryUser } from '@hexa/user-domain/tests/mocks.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';

describe('user-domain aggregate test', () => {
  it('should deposit positive amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    expect(userAgg.user.balance).toEqual(10);
    expect(await repo.getStat()).toEqual(10);

    await userAgg.deposit('gained_by_admin', 10);

    expect(userAgg.user.balance).toEqual(20);
    expect(await repo.getStat()).toEqual(20);
  });

  it('should deposit add negative amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await expect(userAgg.deposit('gained_by_admin', -10))
      .rejects.toThrowError('amount must be more than 0');
  });

  it('should withdraw positive amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await userAgg.withdraw('lost_by_admin', 10);

    expect(userAgg.user.balance).toEqual(0);
    expect(await repo.getStat()).toEqual(0);
  });

  it('should not withdraw negative amount', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await expect(userAgg.withdraw('lost_by_admin', -10))
      .rejects.toThrowError('amount must be more than 0');
  });

  it('should not withdraw more than current balance', async () => {
    const repo = new InMemoryUserAggRepo(10);
    const userAgg = new UserAgg(
      repo,
      repo,
      new InMemoryUser(
        'uid', 'id', 'pw', 'name', 10,
      ),
    );

    await expect(userAgg.withdraw('lost_by_admin', 20))
      .rejects.toThrowError('funds cannot be less than 0');
  });
});
