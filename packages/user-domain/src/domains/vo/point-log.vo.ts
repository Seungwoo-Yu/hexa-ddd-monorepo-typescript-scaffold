import { IUser } from '../entities/user.entity';
import { Enum, PickAndType } from '@hexa/common/types.ts';

export const PointGainReason = [
  'gained_by_admin',
] as const;

export const PointLossReason = [
  'bought_item',
  'lost_by_admin',
] as const;

export interface IPointLog<T extends IUser> {
  userId: PickAndType<T, 'uid'>,
  amount: number,
}

// noinspection JSUnusedGlobalSymbols,TypeScriptAbstractClassConstructorCanBeMadeProtected
export abstract class IPointGainLog<T extends IUser> implements IPointLog<T> {
  constructor(
    public readonly userId: PickAndType<IUser, 'uid'>,
    public readonly reason: Enum<typeof PointGainReason>,
    public readonly amount: number,
  ) {
    if (amount <= 0) {
      throw new RangeError('gain amount cannot be less than or equal to 0');
    }
  }
}

// noinspection JSUnusedGlobalSymbols,TypeScriptAbstractClassConstructorCanBeMadeProtected
export abstract class IPointLossLog<T extends IUser> implements IPointLog<T> {
  constructor(
    public readonly userId: PickAndType<IUser, 'id'>,
    public readonly reason: Enum<typeof PointLossReason>,
    public readonly amount: number,
  ) {
    if (amount <= 0) {
      throw new RangeError('gain amount cannot be greater than or equal to 0');
    }
  }
}
