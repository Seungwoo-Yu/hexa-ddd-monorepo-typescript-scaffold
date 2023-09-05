import { PickType } from '@hexa/common/types';
import { User } from '@hexa/user-stat-context/domains/entities/user.entity';
import { UserAgg } from '@hexa/user-stat-context/domains/aggs/user.agg';

export type PointLogOptions = {
  searchOption?: null | undefined,
  filteredBy?: 'gain' | 'loss',
  amount?: number,
} | {
  searchOption: 'none',
} | {
  searchOption: 'offset',
  filteredBy?: 'gain' | 'loss',
  amount?: number,
  offset: number,
} | {
  searchOption: 'cursor',
  filteredBy?: 'gain' | 'loss',
  amount?: number,
  cursor: number,
};

export interface IUserQuery {
  readByUid(
    uid: PickType<User, 'uid'>,
    options?: PointLogOptions,
  ): Promise<UserAgg>,
}
