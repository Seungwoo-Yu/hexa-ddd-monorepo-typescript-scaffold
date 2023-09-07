import { IStoadminCommand } from '@hexa/stoadmin-context/domains/repositories/commands/stoadmin.command';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';

export class InMemoryStoadminRepo implements IStoadminCommand {
  public async create() {
    return UlidUid.create();
  }

  public async delete() {}

  public async update() {}
}
