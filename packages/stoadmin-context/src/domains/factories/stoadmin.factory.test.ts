import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';
import { Credential, CredentialId, CredentialPassword } from '@hexa/stoadmin-context/domains/vo/credential.vo';
import { StoadminName } from '@hexa/stoadmin-context/domains/vo/stoadmin-name.vo';
import { Store } from '@hexa/stoadmin-context/domains/entities/stoadmin-store.entity';
import { IntegerUid } from '@hexa/stoadmin-context/domains/vo/integer-uid.vo';
import { StoreName } from '@hexa/stoadmin-context/domains/vo/store-name.vo';
import { StoreDesc } from '@hexa/stoadmin-context/domains/vo/store-desc.vo';
import { StoadminFactory, StoadminIdNotMatchedError } from '@hexa/stoadmin-context/domains/factories/stoadmin.factory';
import { InMemoryStoadminRepo } from '@hexa/stoadmin-context/tests/mocks';
import { OmitFuncs } from '@hexa/common/types';

describe('store-domain factory test', () => {
  it('should be generated', async () => {
    const stoadmin = new Stoadmin(
      UlidUid.create(),
      new Credential(
        new CredentialId('id12345'),
        new CredentialPassword('pw12345'),
      ),
      new StoadminName('admin1'),
    );
    const store = new Store(
      new IntegerUid(1),
      new StoreName('store1'),
      new StoreDesc('description 1'),
      stoadmin.uid,
    );
    const stoadminAgg = StoadminFactory.create(stoadmin, [store]);

    expect(stoadminAgg.stoadmin.uid.uid).toStrictEqual(stoadmin.uid.uid);
    expect(stoadminAgg.stores[0].uid.uid).toStrictEqual(store.uid.uid);
  });

  it('should not be generated ' +
    'because some of them do not have matched admin id with stoadmin', async () => {
    const stoadmin = new Stoadmin(
      UlidUid.create(),
      new Credential(
        new CredentialId('id12345'),
        new CredentialPassword('pw12345'),
      ),
      new StoadminName('admin2'),
    );
    const store = new Store(
      new IntegerUid(1),
      new StoreName('store2'),
      new StoreDesc('description 2'),
      UlidUid.create(), // This will occur error
    );

    expect(() => StoadminFactory.create(stoadmin, [store]))
      .toThrowError(new StoadminIdNotMatchedError(stoadmin.uid, store.uid, store.adminUid));
  });

  it('should generate stoadmin', async () => {
    const repo = new InMemoryStoadminRepo();
    const stoadminRaw: Omit<OmitFuncs<Stoadmin>, 'uid'> = {
      credential: new Credential(
        new CredentialId('id1234'),
        new CredentialPassword('pw1234'),
      ),
      name: new StoadminName('adminName'),
    };
    const stoadmin = await StoadminFactory.generate(repo, stoadminRaw);

    expect(stoadmin.stoadmin.uid).toBeDefined();
    expect(stoadmin.stoadmin.credential.id).toStrictEqual(stoadminRaw.credential.id);
    expect(stoadmin.stoadmin.name.nickname).toStrictEqual(stoadminRaw.name.nickname);
  });
});
