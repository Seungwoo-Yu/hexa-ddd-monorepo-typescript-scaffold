import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { Balance } from '@hexa/user-domain/domains/vo/balance.vo.ts';
import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';

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

    userAgg.deposit('gained_by_admin', 10);

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

    expect(() => userAgg.deposit('gained_by_admin', -10))
      .toThrowError('composite validation error: 1 error(s) thrown.\n' +
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

    userAgg.withdraw('lost_by_admin', 10);

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

    expect(() => userAgg.withdraw('lost_by_admin', -10))
      .toThrowError('composite validation error: 1 error(s) thrown.\n' +
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

    expect(() => userAgg.withdraw('lost_by_admin', 20))
      .toThrowError('composite validation error: 1 error(s) thrown.\n' +
        'main error: amount must be less than 10');
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
