import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PickAndType } from '@hexa/common/types.ts';
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
    uid: PickAndType<User, 'uid'>,
    options?: PointLogOptions,
  ): Promise<UserAgg>,
  exists(uid: PickAndType<User, 'uid'>): Promise<boolean>,
}
