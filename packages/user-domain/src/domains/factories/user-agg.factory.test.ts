import { InMemoryUserAggRepo, InMemoryUser, InMemoryUserCommandRepo } from '@hexa/user-domain/tests/mocks.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { UserAggFactory } from '@hexa/user-domain/domains/factories/user-agg.factory.ts';

describe('user-domain aggregate test', () => {
  it('should be generated', async () => {
    const userAggRepo = new InMemoryUserAggRepo();
    const userCommandRepo = new InMemoryUserCommandRepo();

    const agg = await UserAggFactory.create(
      userAggRepo,
      userAggRepo,
      userCommandRepo,
      {
        id: 'id',
        password: 'pw',
        name: 'user',
        balance: 10,
      },
    );

    expect(agg.user.id).toStrictEqual('id');
    expect(agg.user.password).toStrictEqual('pw');
  });
});
