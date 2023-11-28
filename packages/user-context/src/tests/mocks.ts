import { PickType } from '@hexa/common/types';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { Credential, CredentialId } from '@hexa/user-context/domains/vo/credential.vo';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';

export class InMemoryUserRepo implements IUserQuery, IUserCommand {
  private readonly incrIntegerFactory = new IncrIntegerFactory();
  private readonly users = new Map<number, User>();
  private readonly uidToUserMap = new Map<PickType<UlidUid, 'uid'>, number>;
  private readonly idToUserMap = new Map<PickType<CredentialId, 'id'>, number>;

  public async create(user: User) {
    const idx = this.incrIntegerFactory.next();

    this.users.set(idx, user);
    this.uidToUserMap.set(user.uid.uid, idx);
    this.idToUserMap.set(user.credential.id.id, idx);
  }

  public async delete(userUid: PickType<User, 'uid'>) {
    const idx = this.uidToUserMap.get(userUid.uid);
    if (idx == null) {
      throw new Error('user not found');
    }

    const user = this.users.get(idx);
    if (user == null) {
      throw new Error('user not found');
    }

    this.uidToUserMap.delete(userUid.uid);
    this.idToUserMap.delete(user.credential.id.id);
  }

  public async exists(uid: PickType<User, 'uid'>) {
    return (await this.readByUid(uid)) != null;
  }

  public async existsById(credentialId: PickType<Credential, 'id'>) {
    return (await this.readById(credentialId)) != null;
  }

  public async readById(credentialId: PickType<Credential, 'id'>) {
    const idx = this.idToUserMap.get(credentialId.id);
    if (idx == null) {
      return undefined;
    }

    return this.users.get(idx);
  }

  public async readByUid(uid: PickType<User, 'uid'>) {
    const idx = this.uidToUserMap.get(uid.uid);
    if (idx == null) {
      return undefined;
    }

    return this.users.get(idx);
  }

  public async update(user: User) {
    const idx = this.uidToUserMap.get(user.uid.uid);
    if (idx == null) {
      throw new Error('user not found');
    }

    this.users.set(idx, user);
  }
}
