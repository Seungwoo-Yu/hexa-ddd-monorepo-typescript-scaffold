import { IUser } from '../../../domains/entities/user.entity';
import { PickAndType, ReadOnlyProperty } from '@hexa/common/types.ts';

export interface IUserQuery<T extends IUser> {
  readByUid(id: PickAndType<T, 'uid'>): Promise<ReadOnlyProperty<T, 'uid' | 'id'> | undefined>,
  exists(id: PickAndType<T, 'uid'>): Promise<boolean>,
}
