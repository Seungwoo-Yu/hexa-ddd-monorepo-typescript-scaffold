import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainLog, PointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { OmitFuncs, PickAndType } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo.ts';
import { GainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo.ts';
import { LossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo.ts';

export interface IUserCommand {
  createUser(user: Omit<OmitFuncs<User>, 'uid'>): Promise<PickAndType<User, 'uid'>>,
  updateUser(userAgg: UserAgg): Promise<void>,
  deleteUser(userUid: PickAndType<User, 'uid'>): Promise<void>,
  updateBalanceStat(amount: Amount, reason: GainReason | LossReason): Promise<void>,
  createPointLog(log: PointGainLog | PointLossLog): Promise<void>,
}
