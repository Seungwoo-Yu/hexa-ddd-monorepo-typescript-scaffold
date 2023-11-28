import { Credential, CredentialId, CredentialPassword } from '@hexa/sysadmin-context/domains/vo/credential.vo';
import { Name } from '@hexa/sysadmin-context/domains/vo/name.vo';
import { SysadminFactory, SysadminIdDuplicatedError } from '@hexa/sysadmin-context/domains/factories/sysadmin.factory';
import { InMemorySysadminRepo } from '@hexa/sysadmin-context/tests/mocks';
import { OmitFuncs } from '@hexa/common/types';
import { Sysadmin } from '@hexa/sysadmin-context/domains/entities/sysadmin.entity';


describe('sysadmin-domain factory test', () => {
  it('should be generated', async () => {
    const credential = new Credential(
      new CredentialId('id12345'),
      new CredentialPassword('pw12345'),
    );
    const name = new Name('sysadmin1');


    const user = SysadminFactory.create({ credential, name });

    expect(user.credential.id.id).toStrictEqual(credential.id.id);
    expect(user.credential.password.password).toStrictEqual(credential.password.password);
    expect(user.name.nickname).toStrictEqual(name.nickname);
  });

  it('should generate sysadmin', async () => {
    const repo = new InMemorySysadminRepo();
    const userRaw: Pick<OmitFuncs<Sysadmin>, 'credential' | 'name'> = {
      credential: new Credential(
        new CredentialId('id1234'),
        new CredentialPassword('pw1234'),
      ),
      name: new Name('sysadmin2'),
    };
    const user = await SysadminFactory.generate(repo, repo, userRaw);

    expect(user.uid).toBeDefined();
    expect(user.credential.id).toStrictEqual(userRaw.credential.id);
    expect(user.name.nickname).toStrictEqual(userRaw.name.nickname);
  });

  it('should not be generated because ids are duplicated', async () => {
    const repo = new InMemorySysadminRepo();
    const userRaw1: Pick<OmitFuncs<Sysadmin>, 'credential' | 'name'> = {
      credential: new Credential(
        new CredentialId('id1234'), // This will occur error
        new CredentialPassword('pw1234'),
      ),
      name: new Name('sysadmin3'),
    };
    const userRaw2: Pick<OmitFuncs<Sysadmin>, 'credential' | 'name'> = {
      credential: new Credential(
        new CredentialId('id1234'), // This will occur error
        new CredentialPassword('pw1234'),
      ),
      name: new Name('sysadmin4'),
    };

    await SysadminFactory.generate(repo, repo, userRaw1);
    await expect(() => SysadminFactory.generate(repo, repo, userRaw2))
      .rejects.toThrow(new SysadminIdDuplicatedError(userRaw2.credential.id));
  });
});
