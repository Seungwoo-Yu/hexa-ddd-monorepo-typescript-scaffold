import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PickAndType, ReadOnlyProperty } from '@hexa/common/types.ts';

export interface IUserQuery<T extends IUser> {
  readByUid(id: PickAndType<T, 'uid'>): Promise<ReadOnlyProperty<T, 'uid' | 'credential'> | undefined>,
  exists(id: PickAndType<T, 'uid'>): Promise<boolean>,
}
