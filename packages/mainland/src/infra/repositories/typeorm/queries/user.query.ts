import { TypeormRepository } from '@hexa/mainland/infra/repositories/typeorm/typeorm.repository';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { PickType } from '@hexa/common/types';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { UserModel } from '@hexa/mainland/infra/models/typeorm/user.model';
import { UlidUid } from '@hexa/user-context/domains/vo/ulid-uid.vo';
import { Credential, CredentialId, CredentialPassword } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { Balance } from '@hexa/user-context/domains/vo/balance.vo';

export class UserQuery extends TypeormRepository implements IUserQuery {
  public async exists(uid: PickType<User, 'uid'>) {
    return (await this.em.count(UserModel, {
      where: {
        uid: uid.uid,
      },
    })) > 0;
  }

  public async existsById(credential: PickType<Credential, 'id'>) {
    return (await this.em.count(UserModel, {
      where: {
        id: credential.id,
      },
    })) > 0;
  }

  public async readById(credential: PickType<Credential, 'id'>) {
    const model = await this.em.findOne(
      UserModel,
      { where: { id: credential.id } },
    );

    if (model == null) {
      return undefined;
    }

    return this.map(model);
  }

  public async readByUid(uid: PickType<User, 'uid'>) {
    const model = await this.em.findOne(
      UserModel,
      { where: { uid: uid.uid } },
    );

    if (model == null) {
      return undefined;
    }

    return this.map(model);
  }

  private map(userModel: UserModel): User {
    return new User(
      new UlidUid(userModel.uid),
      new Credential(new CredentialId(userModel.id), new CredentialPassword(userModel.password)),
      new Name(userModel.nickname),
      new Balance(userModel.balance),
    );
  }
}
