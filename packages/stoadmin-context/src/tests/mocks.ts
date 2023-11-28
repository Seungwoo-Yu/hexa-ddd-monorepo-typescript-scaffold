import { IStoadminCommand } from '@hexa/stoadmin-context/domains/repositories/commands/stoadmin.command';
import { IStoadminQuery } from '@hexa/stoadmin-context/domains/repositories/queries/stoadmin.query';
import { PickType } from '@hexa/common/types';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';
import { Credential, CredentialId } from '@hexa/stoadmin-context/domains/vo/credential.vo';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';

export class InMemoryStoadminRepo implements IStoadminQuery, IStoadminCommand {
  private readonly incrIntegerFactory = new IncrIntegerFactory();
  private readonly stoadmins = new Map<number, StoadminAgg>();
  private readonly uidToStoadminMap = new Map<PickType<UlidUid, 'uid'>, number>;
  private readonly idToStoadminMap = new Map<PickType<CredentialId, 'id'>, number>;

  public async create(stoadminAgg: StoadminAgg) {
    const idx = this.incrIntegerFactory.next();

    this.stoadmins.set(idx, stoadminAgg);
    this.uidToStoadminMap.set(stoadminAgg.stoadmin.uid.uid, idx);
    this.idToStoadminMap.set(stoadminAgg.stoadmin.credential.id.id, idx);
  }

  public async delete(stoadminUid: PickType<Stoadmin, 'uid'>) {
    const idx = this.uidToStoadminMap.get(stoadminUid.uid);
    if (idx == null) {
      throw new Error('stoadmin not found');
    }

    const stoadmin = this.stoadmins.get(idx);
    if (stoadmin == null) {
      throw new Error('stoadmin not found');
    }

    this.uidToStoadminMap.delete(stoadminUid.uid);
    this.idToStoadminMap.delete(stoadmin.stoadmin.credential.id.id);
  }

  public async exists(uid: PickType<Stoadmin, 'uid'>) {
    return (await this.readByUid(uid)) != null;
  }

  public async existsById(credentialId: PickType<Credential, 'id'>) {
    return (await this.readById(credentialId)) != null;
  }

  public async readById(credentialId: PickType<Credential, 'id'>) {
    const idx = this.idToStoadminMap.get(credentialId.id);
    if (idx == null) {
      return undefined;
    }

    return this.stoadmins.get(idx);
  }

  public async readByUid(uid: PickType<Stoadmin, 'uid'>) {
    const idx = this.uidToStoadminMap.get(uid.uid);
    if (idx == null) {
      return undefined;
    }

    return this.stoadmins.get(idx);
  }

  public async update(stoadminAgg: StoadminAgg) {
    const idx = this.uidToStoadminMap.get(stoadminAgg.stoadmin.uid.uid);
    if (idx == null) {
      throw new Error('stoadmin not found');
    }

    this.stoadmins.set(idx, stoadminAgg);
  }
}
