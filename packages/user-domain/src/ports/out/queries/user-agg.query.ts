import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { IPointGainLog, IPointLog, IPointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { PickAndType } from '@hexa/common/types.ts';

export type PointLogOptions = {
  searchOption: null | undefined,
  amount?: number,
} | {
  searchOption: 'offset',
  amount?: number,
  offset: number,
};

export interface IUserAggQuery<T extends IUser, U extends IPointGainLog<T>, V extends IPointLossLog<T>> {
  readPointLogs(userId: PickAndType<T, 'uid'>, options?: PointLogOptions): Promise<IPointLog<T>[]>,
  readPointGainLogs(user: PickAndType<T, 'uid'>, options?: PointLogOptions): Promise<U[]>,
  readPointLossLogs(user: PickAndType<T, 'uid'>, options?: PointLogOptions): Promise<V[]>,
}
