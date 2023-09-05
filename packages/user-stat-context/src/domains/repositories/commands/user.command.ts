import { Amount } from '@hexa/user-stat-context/domains/vo/amount.vo';
import { GainReason } from '@hexa/user-stat-context/domains/vo/gain-reason.vo';
import { LossReason } from '@hexa/user-stat-context/domains/vo/loss-reason.vo';
import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';

export interface IUserCommand {
  updateUser(userAgg: UserAgg): Promise<void>,
  updateBalanceStat(amount: Amount, reason: GainReason | LossReason): Promise<void>,
}
