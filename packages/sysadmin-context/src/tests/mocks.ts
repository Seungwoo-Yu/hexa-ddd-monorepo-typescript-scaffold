import { PickType } from '@hexa/common/types';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { ISysadminQuery } from '@hexa/sysadmin-context/domains/repositories/queries/sysadmin.query';
import { ISysadminCommand } from '@hexa/sysadmin-context/domains/repositories/commands/sysadmin.command';
import { Sysadmin } from '@hexa/sysadmin-context/domains/entities/sysadmin.entity';
import { Credential, CredentialId } from '@hexa/sysadmin-context/domains/vo/credential.vo';
import { UlidUid } from '@hexa/sysadmin-context/domains/vo/ulid-uid.vo';

export class InMemorySysadminRepo implements ISysadminQuery, ISysadminCommand {
  private readonly incrIntegerFactory = new IncrIntegerFactory();
  private readonly sysadmins = new Map<number, Sysadmin>();
  private readonly uidToSysadminMap = new Map<PickType<UlidUid, 'uid'>, number>;
  private readonly idToSysadminMap = new Map<PickType<CredentialId, 'id'>, number>;

  public async create(sysadmin: Sysadmin) {
    const idx = this.incrIntegerFactory.next();

    this.sysadmins.set(idx, sysadmin);
    this.uidToSysadminMap.set(sysadmin.uid.uid, idx);
    this.idToSysadminMap.set(sysadmin.credential.id.id, idx);
  }

  public async delete(sysadminUid: PickType<Sysadmin, 'uid'>) {
    const idx = this.uidToSysadminMap.get(sysadminUid.uid);
    if (idx == null) {
      throw new Error('sysadmin not found');
    }

    const sysadmin = this.sysadmins.get(idx);
    if (sysadmin == null) {
      throw new Error('sysadmin not found');
    }

    this.uidToSysadminMap.delete(sysadminUid.uid);
    this.idToSysadminMap.delete(sysadmin.credential.id.id);
  }

  public async exists(uid: PickType<Sysadmin, 'uid'>) {
    return (await this.readByUid(uid)) != null;
  }

  public async existsById(credentialId: PickType<Credential, 'id'>) {
    return (await this.readById(credentialId)) != null;
  }

  public async readById(credentialId: PickType<Credential, 'id'>) {
    const idx = this.idToSysadminMap.get(credentialId.id);
    if (idx == null) {
      return undefined;
    }

    return this.sysadmins.get(idx);
  }

  public async readByUid(uid: PickType<Sysadmin, 'uid'>) {
    const idx = this.uidToSysadminMap.get(uid.uid);
    if (idx == null) {
      return undefined;
    }

    return this.sysadmins.get(idx);
  }

  public async update(sysadmin: Sysadmin) {
    const idx = this.uidToSysadminMap.get(sysadmin.uid.uid);
    if (idx == null) {
      throw new Error('sysadmin not found');
    }

    this.sysadmins.set(idx, sysadmin);
  }
}
