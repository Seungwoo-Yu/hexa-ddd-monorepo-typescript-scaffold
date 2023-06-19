import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainReason, PointLossReason } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum,  PickAndType, ReadOnlyProperty } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';

export interface IUserCommand<T extends IUser> {
  createUser(user: Omit<T, 'uid'>): Promise<void>,
  updateUser(userAgg: UserAgg<ReadOnlyProperty<T, 'uid'>>): Promise<void>,
  deleteUser(userUid: PickAndType<T, 'uid'>): Promise<void>,
  updateBalanceStat(balance: number): Promise<void>,
  createPointLog(
    userUid: PickAndType<T, 'uid'>,
    reason: Enum<typeof PointGainReason | typeof PointLossReason>,
    balance: number,
  ): Promise<void>,
}
