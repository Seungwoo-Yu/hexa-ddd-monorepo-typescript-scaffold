import { AssertStaticInterface } from '@hexa/common/decorators';
import { GeneratorOf } from '@hexa/common/interfaces';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { Store } from '@hexa/stoadmin-context/domains/entities/stoadmin-store.entity';
import { OmitFuncs, PickType } from '@hexa/common/types';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';
import { IStoadminCommand } from '@hexa/stoadmin-context/domains/repositories/commands/stoadmin.command';

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

@AssertStaticInterface<GeneratorOf<StoadminAgg>>()
export class StoadminFactory {
  public static create(stoadmin: Stoadmin, stores: Store[] = []) {
    stores.forEach(store => {
      if (!stoadmin.uid.equals(store.adminUid)) {
        throw new StoadminIdNotMatchedError(stoadmin.uid, store.uid, store.adminUid);
      }
    });

    return new StoadminAgg(stoadmin, stores);
  }

  public static async generate(stoadminCommand: IStoadminCommand, _stoadmin: Omit<OmitFuncs<Stoadmin>, 'uid'>) {
    const stoadmin = new Stoadmin(
      UlidUid.create(),
      _stoadmin.credential,
      _stoadmin.name,
    );
    const stoadminAgg = StoadminFactory.create(stoadmin);

    await stoadminCommand.create(stoadminAgg);

    return stoadminAgg;
  }
}
