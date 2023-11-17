import { IRouter } from 'express';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { CreateUserUseCase, DuplicatedIdError } from '@hexa/mainland/app/create-user.use-case';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { CompositeValError } from '@hexa/common/errors/composite';
import { CreateUserTransactionManager } from '@hexa/mainland/infra/adapters/out/create-user-transaction.manager';

export function createUserAdapter(express: IRouter, manager: CreateUserTransactionManager) {
  const useCase = new CreateUserUseCase(manager);

  express.post('/v1/user', (req, res) => {
    pipe(
      E.Do,
      E.apS(
        'credential',
        E.tryCatch(
          () => new Credential(req.body?.id, req.body?.password),
          (e) => e as CompositeValError,
        ),
      ),
      E.apS(
        'name',
        E.tryCatch(
          () => new Name(req.body?.nickname),
          (e) => e as CompositeValError,
        ),
      ),
      TE.fromEither,
      TE.flatMap(
        ({ credential, name }) => {
          return TE.tryCatch(
            async () => {
              return await useCase.invoke(credential, name);
            },
            (e) => e as DuplicatedIdError | CompositeValError | Error,
          );
        },
      ),
      TE.match(
        e => {
          if (e instanceof CompositeValError) {
            res.status(422).send({
              error: e,
            });
            return;
          }

          if (e instanceof DuplicatedIdError) {
            res.status(409).send({
              error: e,
            });
            return;
          }

          res.status(500).send({
            error: e,
          });
        },
        () => {
          res.status(200).send();
        },
      ),
    )();
  });
}
