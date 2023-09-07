import { AssertStaticInterface } from '@hexa/common/decorators';
import { IFactory } from '@hexa/common/interfaces';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { Store } from '@hexa/stoadmin-context/domains/entities/stoadmin-store.entity';
import { PickType } from '@hexa/common/types';

export class StoadminIdNotMatchedError extends Error {
  constructor(
    stoadminId: PickType<Stoadmin, 'uid'>,
    storeId: PickType<Store, 'uid'>,
    invalidStoadminId: PickType<Stoadmin, 'uid'>,
  ) {
    super('store admin ' + invalidStoadminId.uid + ' found in store ' + storeId.uid +
      ' is not matched with store admin ' + stoadminId.uid);
  }
}

@AssertStaticInterface<IFactory<StoadminAgg>>()
export class StoadminFactory {
  public static create(stoadmin: Stoadmin, stores: Store[] = []) {
    stores.forEach(store => {
      if (!stoadmin.uid.equals(store.adminUid)) {
        throw new StoadminIdNotMatchedError(stoadmin.uid, store.uid, store.adminUid);
      }
    });

    return new StoadminAgg(stoadmin, stores);
  }
}
