import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PartialExcept, PickAndType } from '@hexa/common/types.ts';

export interface IUserCommand<T extends IUser> {
  create(user: Omit<T, 'uid'>): Promise<T>,
  update(user: PartialExcept<T, 'uid' | 'credential'>): Promise<void>,
  delete(userUid: PickAndType<T, 'uid'>): Promise<void>,
}
