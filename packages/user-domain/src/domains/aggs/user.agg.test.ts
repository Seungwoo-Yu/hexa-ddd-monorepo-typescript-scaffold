import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { Balance } from '@hexa/user-domain/domains/vo/balance.vo.ts';
import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainLog, PointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { GainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo.ts';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo.ts';
import { CreatedAt } from '@hexa/user-domain/domains/vo/created-at.vo.ts';
import { LossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo.ts';

describe('user-domain aggregate test', () => {
  it('should deposit positive amount', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    expect(userAgg.user.balance.amount).toEqual(10);

    const log = new PointGainLog(
      userAgg.user.uid,
      new GainReason('gained_by_admin'),
      new Amount(10),
      CreatedAt.create(),
    );
    userAgg.deposit(log);

    expect(userAgg.user.balance.amount).toEqual(20);
  });

  it('should not deposit add negative amount', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    expect(() => {
      return new PointGainLog(
        userAgg.user.uid,
        new GainReason('gained_by_admin'),
        new Amount(-10),
        CreatedAt.create(),
      );
    }).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: amount must be greater than 0');
  });

  it('should withdraw positive amount', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    const log = new PointLossLog(
      userAgg.user.uid,
      new LossReason('lost_by_admin'),
      new Amount(10),
      CreatedAt.create(),
    );

    userAgg.withdraw(log);

    expect(userAgg.user.balance.amount).toEqual(0);
  });

  it('should not withdraw negative amount', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    expect(() => {
      return new PointLossLog(
        userAgg.user.uid,
        new LossReason('lost_by_admin'),
        new Amount(-10),
        CreatedAt.create(),
      );
    }).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: amount must be greater than 0');
  });

  it('should not withdraw more than current balance', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    expect(() => {
      const log = new PointLossLog(
        userAgg.user.uid,
        new LossReason('lost_by_admin'),
        new Amount(20),
        CreatedAt.create(),
      );
      userAgg.withdraw(log);
    }).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: withdrawAmount must be less than 10');
  });

  it('should change their credential', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    userAgg.changeCredential('id1234', 'newPassword1234');
  });

  it('should not change id from their credential', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    expect(() => userAgg.changeCredential('newId1234', 'newPw1234'))
      .toThrowError('id must be immutable');
  });

  it('should not change their credential because it is not changed actually', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    expect(() => userAgg.changeCredential('id1234', 'pw1234'))
      .toThrowError('credential is not changed');
  });

  it('should change their name', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    userAgg.changeName('newNameHere');
  });

  it('should not change their name because it is not changed actually', async () => {
    const userAgg = new UserAgg(
      new User(
        UlidUid.create(),
        new Credential('id1234', 'pw1234'),
        new Name('name1234'),
        new Balance(10),
      ),
      [],
    );

    expect(() => userAgg.changeName('name1234'))
      .toThrowError('name is not changed');
  });
});
