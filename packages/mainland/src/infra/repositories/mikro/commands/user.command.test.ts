import { TestDockerInfo, useTestDocker } from '@hexa/common/test-utils';
import { initMikro } from '@hexa/mainland/test-utils';
import { Credential, CredentialId, CredentialPassword } from '@hexa/user-context/domains/vo/credential.vo';
import { UserCommand } from '@hexa/mainland/infra/repositories/mikro/commands/user.command';
import { UserFactory } from '@hexa/user-context/domains/factories/user.factory';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { MikroORM } from '@mikro-orm/core';
import { PostgreSqlDriver } from '@mikro-orm/postgresql';
import { UserModel } from '@hexa/mainland/infra/models/mikro/user.model';

const store: { testDockerInfo: TestDockerInfo, mikro: MikroORM<PostgreSqlDriver>, repo: UserCommand } =
  {} as { testDockerInfo: TestDockerInfo, mikro: MikroORM<PostgreSqlDriver>, repo: UserCommand };

describe('user command test', () => {
  useTestDocker(store);

  beforeAll(async () => {
    store.mikro = await initMikro(store.testDockerInfo);
    store.repo = new UserCommand(store.mikro.em.fork());
  });

  afterAll(async () => {
    await store.mikro.close(true);
  });

  it('should create user', async () => {
    const user = UserFactory.create({
      credential: new Credential(
        new CredentialId('id123456'),
        new CredentialPassword('password1234'),
      ),
      name: new Name('test-user'),
    });
    await store.repo.create(user);

    const inserted = await store.mikro.em.fork().findOneOrFail(UserModel, {
      uid: user.uid.uid,
    });
    expect(inserted).toBeDefined();
    expect(inserted.uid).toStrictEqual(user.uid.uid);
    expect(inserted.id).toStrictEqual(user.credential.id.id);
    expect(inserted.nickname).toStrictEqual(user.name.nickname);
    expect(inserted.balance).toStrictEqual(user.balance.amount);
  });

  it('should delete user', async () => {
    const user = UserFactory.create({
      credential: new Credential(
        new CredentialId('id1234567'),
        new CredentialPassword('password1234'),
      ),
      name: new Name('test-user-2'),
    });
    await store.repo.create(user);

    await store.repo.delete(user.uid);

    const cnt = await store.mikro.em.fork().count(UserModel, { uid: user.uid.uid });
    expect(cnt).toBeDefined();
    expect(cnt).toStrictEqual(0);
  });

  it('should update user', async () => {
    const user = UserFactory.create({
      credential: new Credential(
        new CredentialId('id12345678'),
        new CredentialPassword('password1234'),
      ),
      name: new Name('test-user-3'),
    });
    await store.repo.create(user);

    const inserted = await store.mikro.em.fork().findOneOrFail(UserModel, {
      uid: user.uid.uid,
    });
    expect(inserted).toBeDefined();
    expect(inserted.nickname).toStrictEqual(user.name.nickname);

    const changedName = new Name('changed-user');
    user.changeName(changedName);
    await store.repo.update(user);

    const updated = await store.mikro.em.fork().findOneOrFail(UserModel, {
      uid: user.uid.uid,
    });
    expect(updated).toBeDefined();
    expect(updated.nickname).toStrictEqual(changedName.nickname);
  });
});
