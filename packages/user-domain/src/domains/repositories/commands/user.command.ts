import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainLog, PointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { OmitFuncs, PickType } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo.ts';
import { GainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo.ts';
import { LossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo.ts';

export interface IUserCommand {
  createUser(user: Omit<OmitFuncs<User>, 'uid'>): Promise<PickType<User, 'uid'>>,
  updateUser(userAgg: UserAgg): Promise<void>,
  deleteUser(userUid: PickType<User, 'uid'>): Promise<void>,
  updateBalanceStat(amount: Amount, reason: GainReason | LossReason): Promise<void>,
  createPointLog(log: Omit<OmitFuncs<PointGainLog>, 'createdAt'>): Promise<PointGainLog>,
  createPointLog(log: Omit<OmitFuncs<PointLossLog>, 'createdAt'>): Promise<PointLossLog>,
  createPointLog(log: Omit<OmitFuncs<PointGainLog | PointLossLog>, 'createdAt'>): Promise<PointGainLog | PointLossLog>,
}
