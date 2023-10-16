import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';

export interface IUserCommand {
  updateUser(userAgg: UserAgg): Promise<void>,
}
