import { User } from '@hexa/user-domain/domains/entities/user.entity';
import { PointGainLog, PointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo';
import { OmitFuncs, PickType } from '@hexa/common/types';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo';
import { GainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo';
import { LossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo';

export interface IUserCommand {
  createUser(user: Omit<OmitFuncs<User>, 'uid'>): Promise<PickType<User, 'uid'>>,
  updateUser(userAgg: UserAgg): Promise<void>,
  deleteUser(userUid: PickType<User, 'uid'>): Promise<void>,
  updateBalanceStat(amount: Amount, reason: GainReason | LossReason): Promise<void>,
  createPointLog(log: Omit<OmitFuncs<PointGainLog>, 'createdAt'>): Promise<PointGainLog>,
  createPointLog(log: Omit<OmitFuncs<PointLossLog>, 'createdAt'>): Promise<PointLossLog>,
  createPointLog(log: Omit<OmitFuncs<PointGainLog | PointLossLog>, 'createdAt'>): Promise<PointGainLog | PointLossLog>,
}
