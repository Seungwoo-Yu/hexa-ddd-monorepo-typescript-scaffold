import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { MikroRepository } from '@hexa/mainland/infra/repositories/mikro/mikro.repository';
import { PickType } from '@hexa/common/types';
import { UserModel } from '@hexa/mainland/infra/models/mikro/user.model';
import { User } from '@hexa/user-context/domains/entities/user.entity';

export class UserCommand extends MikroRepository implements IUserCommand {
  public async create(user: User) {
    await this.em.persistAndFlush(
      this.em.create(UserModel, {
        uid: user.uid.uid,
        id: user.credential.id,
        password: user.credential.password,
        nickname: user.name.nickname,
        balance: user.balance.amount,
      }),
    );
  }

  public async delete(userUid: PickType<User, 'uid'>) {
    await this.em.removeAndFlush(
      this.em.getReference(UserModel, userUid.uid),
    );
  }

  public async update(user: User) {
    await this.em.nativeUpdate(UserModel, { uid: user.uid.uid }, {
      id: user.credential.id,
      password: user.credential.password,
      nickname: user.name.nickname,
      balance: user.balance.amount,
    });
  }
}
