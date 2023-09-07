import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';
import { Credential } from '@hexa/stoadmin-context/domains/vo/credential.vo';
import { StoadminName } from '@hexa/stoadmin-context/domains/vo/stoadmin-name.vo';
import { Store } from '@hexa/stoadmin-context/domains/entities/stoadmin-store.entity';
import { IntegerUid } from '@hexa/stoadmin-context/domains/vo/integer-uid.vo';
import { StoreName } from '@hexa/stoadmin-context/domains/vo/store-name.vo';
import { StoreDesc } from '@hexa/stoadmin-context/domains/vo/store-desc.vo';
import { StoadminFactory, StoadminIdNotMatchedError } from '@hexa/stoadmin-context/domains/factories/stoadmin.factory';

describe('store-domain factory test', () => {
  it('should be generated', async () => {
    const stoadmin = new Stoadmin(
      UlidUid.create(),
      new Credential(
        'id12345',
        'pw12345',
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
        'id12345',
        'pw12345',
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
});
