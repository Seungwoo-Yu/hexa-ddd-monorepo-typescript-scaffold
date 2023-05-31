import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainReason, PointLossReason } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum, PickAndType } from '@hexa/common/types.ts';

export interface IUserAggCommand<T extends IUser> {
  updateBalanceStat(balance: number): Promise<void>,
  createPointLog(
    userUid: PickAndType<T, 'uid'>,
    reason: Enum<typeof PointGainReason | typeof PointLossReason>,
    balance: number,
  ): Promise<void>,
}
