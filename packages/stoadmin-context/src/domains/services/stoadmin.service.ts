import { IStoadminCommand } from '@hexa/stoadmin-context/domains/repositories/commands/stoadmin.command';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { OmitFuncs } from '@hexa/common/types';
import { StoadminFactory } from '@hexa/stoadmin-context/domains/factories/stoadmin.factory';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';

export class StoadminService {
  constructor(
    private readonly stoadminCommand: IStoadminCommand,
  ) {
  }

  public async create(_stoadmin: Omit<OmitFuncs<Stoadmin>, 'uid'>) {
    const stoadmin = new Stoadmin(
      UlidUid.create(),
      _stoadmin.credential,
      _stoadmin.name,
    );
    const stoadminAgg = StoadminFactory.create(stoadmin);

    await this.stoadminCommand.create(stoadminAgg);

    return stoadminAgg;
  }
}
