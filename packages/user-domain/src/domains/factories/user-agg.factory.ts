import { IFactory } from '@hexa/common/interfaces.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { IUserCommand } from '@hexa/user-domain/ports/out/commands/user.command.ts';
import { UserAgg } from '@hexa/user-domain/domains/aggs/user.agg.ts';
import { IUserAggQuery } from '@hexa/user-domain/ports/out/queries/user-agg.query.ts';
import { IUserAggCommand } from '@hexa/user-domain/ports/out/commands/user-agg.command.ts';
import { IPointGainLog, IPointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo.ts';

@AssertStaticInterface<IFactory<UserAgg<IUser, IPointGainLog<IUser>, IPointLossLog<IUser>>>>()
export class UserAggFactory {
  static async create<T extends IUser, U extends IPointGainLog<T>, V extends IPointLossLog<T>>(
    userAggQuery: IUserAggQuery<T, U, V>,
    userAggCommand: IUserAggCommand<T>,
    userCommand: IUserCommand<T>,
    _user: Omit<T, 'uid'>,
  ) {
    const user = await userCommand.create(_user);

    return new UserAgg(
      userAggQuery,
      userAggCommand,
      user,
    );
  }
}
