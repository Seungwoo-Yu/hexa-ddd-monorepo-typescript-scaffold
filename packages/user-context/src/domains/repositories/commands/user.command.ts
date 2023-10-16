import { User } from '@hexa/user-context/domains/entities/user.entity';
import { PickType } from '@hexa/common/types';

export interface IUserCommand {
  create(user: User): Promise<void>,
  update(user: User): Promise<void>,
  delete(userUid: PickType<User, 'uid'>): Promise<void>,
}
