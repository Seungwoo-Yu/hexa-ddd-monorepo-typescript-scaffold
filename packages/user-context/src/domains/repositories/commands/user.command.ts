import { User } from '@hexa/user-context/domains/entities/user.entity';
import { OmitFuncs, PickType } from '@hexa/common/types';

export interface IUserCommand {
  createUser(user: Omit<OmitFuncs<User>, 'uid'>): Promise<PickType<User, 'uid'>>,
  updateUser(user: User): Promise<void>,
  deleteUser(userUid: PickType<User, 'uid'>): Promise<void>,
}
