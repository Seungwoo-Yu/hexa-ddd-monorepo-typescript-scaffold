import { User } from '@hexa/user-domain/domains/entities/user.entity';
import { PickType } from '@hexa/common/types';
import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';

export interface IUserQuery {
  readByUid(uid: PickType<User, 'uid'>): Promise<UserAgg>,
  exists(uid: PickType<User, 'uid'>): Promise<boolean>,
}
