import { IRouter } from 'express';
import { Credential, CredentialId, CredentialPassword } from '@hexa/user-context/domains/vo/credential.vo';
import { Name } from '@hexa/user-context/domains/vo/name.vo';
import { pipe } from 'fp-ts/lib/function';
import * as E from 'fp-ts/lib/Either';
import * as TE from 'fp-ts/lib/TaskEither';
import { CompositeValError } from '@hexa/common/errors/composite';
import { CreateUserInPort } from '@hexa/mainland/app/ports/in/create-user-in.port';
import { UserIdDuplicatedError } from '@hexa/user-context/domains/factories/user.factory';

export function createUserAdapter(express: IRouter, createUserInPort: CreateUserInPort) {
  express.post('/v1/user', (req, res) => {
    pipe(
      E.Do,
      E.apS(
        'credential',
        E.tryCatch(
          () => new Credential(new CredentialId(req.body?.id), new CredentialPassword(req.body?.password)),
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
              return await createUserInPort.invoke(credential, name);
            },
            (e) => e as UserIdDuplicatedError | CompositeValError | Error,
          );
        },
      ),
      TE.match(
        e => {
          console.error(e);

          if (e instanceof CompositeValError) {
            res.status(422).send(e);
            return;
          }

          if (e instanceof UserIdDuplicatedError) {
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
