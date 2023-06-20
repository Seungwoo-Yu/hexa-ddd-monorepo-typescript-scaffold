import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PickAndType, ReadOnlyProperty } from '@hexa/common/types.ts';
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

export interface IUserQuery<T extends IUser> {
  readByUid(
    uid: PickAndType<T, 'uid'>,
    options?: PointLogOptions,
  ): Promise<UserAgg<ReadOnlyProperty<T, 'uid' | 'credential'>>>,
  exists(uid: PickAndType<T, 'uid'>): Promise<boolean>,
}
