import { Express } from 'express';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { CreateUserUseCase } from '@hexa/mainland/app/use-cases/create-user.use-case';
import { UserCheckerOutMikroAdapter } from '@hexa/mainland/infra/adapters/out/mikro/user-checker.out.adapter';
import { UserCreatorOutMikroAdapter } from '@hexa/mainland/infra/adapters/out/mikro/user-creator-out.adapter';
import { MikroORM } from '@mikro-orm/core';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { CompositeValError } from '@hexa/common/errors/composite';
import { UserCreatorDuplicatedIdError } from '@hexa/mainland/app/ports/in/user-creator-in.port';

export function register(orm: MikroORM, express: Express) {
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
              await orm.em.transactional(async em => {
                const useCase = new CreateUserUseCase(
                  new UserCheckerOutMikroAdapter(orm, em),
                  new UserCreatorOutMikroAdapter(orm, em),
                );

                await useCase.create(credential, name);
              });
            },
            (e) => e as UserCreatorDuplicatedIdError | Error,
          );
        },
      ),
      TE.match(
        e => {
          console.log(e);
          if (e instanceof CompositeValError) {
            res.status(422).send({
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
