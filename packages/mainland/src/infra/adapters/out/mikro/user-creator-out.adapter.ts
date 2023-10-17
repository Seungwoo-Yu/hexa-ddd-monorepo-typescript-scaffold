import { UserCreatorOutPort } from '@hexa/mainland/app/ports/out/user-creator-out.port';
import { User } from '@hexa/user-context/domains/entities/user.entity';
import { BaseMikroAdapter } from '@hexa/mainland/infra/adapters/out/mikro/base.adapter';
import { User as UserModel } from '@hexa/mainland/infra/models/mikro/user.model';

export class UserCreatorOutMikroAdapter extends BaseMikroAdapter implements UserCreatorOutPort {
  public async create(user: User) {
    this.em.create(UserModel, {
      uid: user.uid.uid,
      id: user.credential.id,
      password: user.credential.password,
      nickname: user.name.nickname,
      balance: user.balance.amount,
    });
  }
}
