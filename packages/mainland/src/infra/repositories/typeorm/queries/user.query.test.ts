import { TestDockerInfo, useTestDocker } from '@hexa/common/test-utils';
import { initTypeORM } from '@hexa/mainland/test-utils';
import { UserModel } from '@hexa/mainland/infra/models/typeorm/user.model';
import { UserFactory } from '@hexa/user-context/domains/factories/user.factory';
import { Credential, CredentialId, CredentialPassword } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { UserQuery } from '@hexa/mainland/infra/repositories/typeorm/queries/user.query';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';

const store: { testDockerInfo: TestDockerInfo, repo: UserQuery, user: User } =
  {} as { testDockerInfo: TestDockerInfo, repo: UserQuery, user: User };

describe('user query test', () => {
  useTestDocker(store);

  beforeAll(async () => {
    const typeorm = await initTypeORM(store.testDockerInfo);

    store.repo = new UserQuery(typeorm.createEntityManager());
    store.user = UserFactory.create({
      credential: new Credential(
        new CredentialId('id123456'),
        new CredentialPassword('password1234'),
      ),
      name: new Name('test-user'),
    });
    const repo = typeorm.getRepository(UserModel);
    await repo.save([
      {
        uid: store.user.uid.uid,
        id: store.user.credential.id.id,
        password: store.user.credential.password.password,
        nickname: store.user.name.nickname,
        balance: store.user.balance.amount,
      },
    ]);
  });

  it('should exist with specific id', async () => {
    const existed = await store.repo.existsById(store.user.credential.id);
    expect(existed).toBeDefined();
    expect(existed).toStrictEqual(true);
  });

  it('should not exist with unknown id', async () => {
    const existed = await store.repo.existsById(new CredentialId('something-unknown'));
    expect(existed).toBeDefined();
    expect(existed).toStrictEqual(false);
  });

  it('should exist with specific uid', async () => {
    const existed = await store.repo.exists(store.user.uid);
    expect(existed).toBeDefined();
    expect(existed).toStrictEqual(true);
  });

  it('should not exist with unknown uid', async () => {
    const existed = await store.repo.exists(UlidUid.create());
    expect(existed).toBeDefined();
    expect(existed).toStrictEqual(false);
  });

  it('should read with specific id', async () => {
    const user = await store.repo.readById(store.user.credential.id);
    expect(user).toBeDefined();
    expect(user!.credential.id.id).toStrictEqual(store.user.credential.id.id);
  });

  it('should not read with unknown id', async () => {
    const user = await store.repo.readById(new CredentialId('something-unknown'));
    expect(user).toBeUndefined();
  });

  it('should read with specific uid', async () => {
    const user = await store.repo.readByUid(store.user.uid);
    expect(user).toBeDefined();
    expect(user!.uid.uid).toStrictEqual(store.user.uid.uid);
  });

  it('should not read with unknown uid', async () => {
    const user = await store.repo.readByUid(UlidUid.create());
    expect(user).toBeUndefined();
  });
});
