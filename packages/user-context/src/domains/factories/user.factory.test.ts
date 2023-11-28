import { Credential, CredentialId, CredentialPassword } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { UserFactory, UserIdDuplicatedError } from '@hexa/user-context/domains/factories/user.factory';
import { InMemoryUserRepo } from '@hexa/user-context/tests/mocks';
import { OmitFuncs } from '@hexa/common/types';
import { User } from '@hexa/user-context/domains/entities/user.entity';

describe('user-domain factory test', () => {
  it('should be generated', async () => {
    const credential = new Credential(
      new CredentialId('id12345'),
      new CredentialPassword('pw12345'),
    );
    const name = new Name('user1');


    const user = UserFactory.create({ credential, name });

    expect(user.credential.id.id).toStrictEqual(credential.id.id);
    expect(user.credential.password.password).toStrictEqual(credential.password.password);
    expect(user.name.nickname).toStrictEqual(name.nickname);
  });

  it('should generate user', async () => {
    const repo = new InMemoryUserRepo();
    const userRaw: Pick<OmitFuncs<User>, 'credential' | 'name'> = {
      credential: new Credential(
        new CredentialId('id1234'),
        new CredentialPassword('pw1234'),
      ),
      name: new Name('user2'),
    };
    const user = await UserFactory.generate(repo, repo, userRaw);

    expect(user.uid).toBeDefined();
    expect(user.credential.id).toStrictEqual(userRaw.credential.id);
    expect(user.name.nickname).toStrictEqual(userRaw.name.nickname);
  });

  it('should not be generated because ids are duplicated', async () => {
    const repo = new InMemoryUserRepo();
    const userRaw1: Pick<OmitFuncs<User>, 'credential' | 'name'> = {
      credential: new Credential(
        new CredentialId('id1234'), // This will occur error
        new CredentialPassword('pw1234'),
      ),
      name: new Name('user3'),
    };
    const userRaw2: Pick<OmitFuncs<User>, 'credential' | 'name'> = {
      credential: new Credential(
        new CredentialId('id1234'), // This will occur error
        new CredentialPassword('pw1234'),
      ),
      name: new Name('user4'),
    };

    await UserFactory.generate(repo, repo, userRaw1);
    await expect(() => UserFactory.generate(repo, repo, userRaw2))
      .rejects.toThrow(new UserIdDuplicatedError(userRaw2.credential.id));
  });
});
