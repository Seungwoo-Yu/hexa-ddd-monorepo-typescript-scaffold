import { IsolatedScopeOperation, IsolatedScope, Scope, ScopeOperation } from '@hexa/common/interfaces';
import { IUserCommand } from '@hexa/user-context/domains/repositories/commands/user.command';
import { IUserQuery } from '@hexa/user-context/domains/repositories/queries/user.query';

export interface CreateUserScope extends Scope, ScopeOperation<CreateUserScope>,
  IsolatedScope, IsolatedScopeOperation<CreateUserScope> {
  userCommand: IUserCommand,
  userQuery: IUserQuery,
}
