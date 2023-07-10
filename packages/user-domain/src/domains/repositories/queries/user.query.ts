import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PickType } from '@hexa/common/types.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';

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
  searchOption: 'lastId',
  filteredBy?: 'gain' | 'loss',
  amount?: number,
  lastId: number,
};

export interface IUserQuery {
  readByUid(
    uid: PickType<User, 'uid'>,
    options?: PointLogOptions,
  ): Promise<UserAgg>,
  exists(uid: PickType<User, 'uid'>): Promise<boolean>,
}
