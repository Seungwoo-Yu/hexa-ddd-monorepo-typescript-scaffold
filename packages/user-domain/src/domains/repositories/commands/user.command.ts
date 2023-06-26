import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainReason, PointLossReason } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum, OmitFuncs, PickAndType } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';

export interface IUserCommand {
  createUser(user: Omit<OmitFuncs<User>, 'uid'>): Promise<PickAndType<User, 'uid'>>,
  updateUser(userAgg: UserAgg): Promise<void>,
  deleteUser(userUid: PickAndType<User, 'uid'>): Promise<void>,
  updateBalanceStat(balance: number): Promise<void>,
  createPointLog(
    userUid: PickAndType<User, 'uid'>,
    reason: Enum<typeof PointGainReason | typeof PointLossReason>,
    balance: number,
  ): Promise<void>,
}
