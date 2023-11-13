import { User } from '@hexa/user-context/domains/entities/user.entity';
import { PickType } from '@hexa/common/types';

export interface IUserQuery {
  readByUid(uid: PickType<User, 'uid'>): Promise<User | undefined>,
  exists(uid: PickType<User, 'uid'>): Promise<boolean>,
}
