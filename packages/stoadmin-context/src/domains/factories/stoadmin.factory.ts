import { AssertStaticInterface } from '@hexa/common/decorators';
import { GeneratorOf } from '@hexa/common/interfaces';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { Store } from '@hexa/stoadmin-context/domains/entities/stoadmin-store.entity';
import { OmitFuncs, PickType } from '@hexa/common/types';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';
import { IStoadminCommand } from '@hexa/stoadmin-context/domains/repositories/commands/stoadmin.command';
import { IStoadminQuery } from '@hexa/stoadmin-context/domains/repositories/queries/stoadmin.query';
import { Credential } from '@hexa/stoadmin-context/domains/vo/credential.vo';

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

export class StoadminIdDuplicatedError extends Error {
  constructor(
    stoadminId: PickType<Credential, 'id'>,
  ) {
    super('id ' + stoadminId + ' is duplicated');
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

  public static async generate(
    stoadminQuery: IStoadminQuery,
    stoadminCommand: IStoadminCommand,
    _stoadmin: Omit<OmitFuncs<Stoadmin>, 'uid'>,
  ) {
    if (await stoadminQuery.existsById(_stoadmin.credential.id)) {
      throw new StoadminIdDuplicatedError(_stoadmin.credential.id);
    }

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
