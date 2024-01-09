import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { TransactionManagerOutPort } from '@hexa/mainland/app/ports/out/transaction-manager-out.port';

export interface CreateUserRepoOutPort {
  readonly query: IUserQuery,
  readonly command: IUserCommand,
  readonly transactionManager: TransactionManagerOutPort,
}
