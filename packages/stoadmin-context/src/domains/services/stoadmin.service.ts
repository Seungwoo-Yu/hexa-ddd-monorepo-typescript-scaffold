import { IStoadminCommand } from '@hexa/stoadmin-context/domains/repositories/commands/stoadmin.command';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { OmitFuncs } from '@hexa/common/types';
import { StoadminFactory } from '@hexa/stoadmin-context/domains/factories/stoadmin.factory';

export class StoadminService {
  constructor(
    private readonly stoadminCommand: IStoadminCommand,
  ) {
  }

  public async create(_stoadmin: Omit<OmitFuncs<Stoadmin>, 'uid'>) {
    const stoadminUid = await this.stoadminCommand.create(_stoadmin);
    const stoadmin = new Stoadmin(
      stoadminUid,
      _stoadmin.credential,
      _stoadmin.name,
    );

    return StoadminFactory.create(stoadmin);
  }
}
