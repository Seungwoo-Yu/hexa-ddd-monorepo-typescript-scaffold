import { InMemoryStoadminRepo } from '@hexa/stoadmin-context/tests/mocks';
import { StoadminService } from '@hexa/stoadmin-context/domains/services/stoadmin.service';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { Credential } from '@hexa/stoadmin-context/domains/vo/credential.vo';
import { OmitFuncs } from '@hexa/common/types';
import { StoadminName } from '@hexa/stoadmin-context/domains/vo/stoadmin-name.vo';

describe('stoadmin-domain service test', () => {
  it('should create stoadmin', async () => {
    const repo = new InMemoryStoadminRepo();
    const service = new StoadminService(repo);
    const stoadminRaw: Omit<OmitFuncs<Stoadmin>, 'uid'> = {
      credential: new Credential(
        'id1234',
        'pw1234',
      ),
      name: new StoadminName('adminName'),
    };
    const stoadmin = await service.create(stoadminRaw);

    expect(stoadmin.stoadmin.uid).toBeDefined();
    expect(stoadmin.stoadmin.credential.id).toStrictEqual(stoadminRaw.credential.id);
    expect(stoadmin.stoadmin.name.nickname).toStrictEqual(stoadminRaw.name.nickname);
  });
});
