import { MikroRepository } from '@hexa/mainland/infra/repositories/mikro/mikro.repository';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { PickType } from '@hexa/common/types';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { UserModel } from '@hexa/mainland/infra/models/mikro/user.model';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { Balance } from '@hexa/user-context/domains/vo/balance.vo';

export class UserQuery extends MikroRepository implements IUserQuery {
  public async exists(uid: PickType<User, 'uid'>) {
    return (await this.em.count(UserModel, {
      uid: uid.uid,
    })) > 0;
  }

  public async existsById(credential: PickType<User, 'credential'>) {
    return (await this.em.count(UserModel, {
      id: credential.id,
    })) > 0;
  }

  public async readById(credential: PickType<User, 'credential'>) {
    const model = await this.em.findOne(
      UserModel,
      { id: credential.id },
    );

    if (model == null) {
      return undefined;
    }

    return this.map(model);
  }

  public async readByUid(uid: PickType<User, 'uid'>) {
    const model = await this.em.findOne(
      UserModel,
      { uid: uid.uid },
    );

    if (model == null) {
      return undefined;
    }

    return this.map(model);
  }

  private map(userModel: UserModel): User {
    return new User(
      new UlidUid(userModel.uid),
      new Credential(userModel.id, userModel.password),
      new Name(userModel.nickname),
      new Balance(userModel.balance),
    );
  }
}
