import { z } from 'zod';
import { Equality } from '@hexa/common/interfaces.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { unifyZodMessages } from '@hexa/common/utils.ts';

export class Credential implements Equality {
  constructor(
    public readonly id: string,
    public readonly password: string,
  ) {
    const idResult = z.string({ errorMap: unifyZodMessages('id') })
      .nonempty()
      .min(1)
      .max(30)
      .refine(
        (id) => id === encodeURIComponent(id),
        'id contains unacceptable characters',
      ).safeParse(id);

    if (!idResult.success) {
      throw CompositeValError.fromZodError(idResult.error);
    }

    const pwResult = z.string({ errorMap: unifyZodMessages('password') })
      .nonempty()
      .min(1)
      .refine(
        (id) => id === encodeURIComponent(id),
        'password contains unacceptable characters',
      ).safeParse(password);

    if (!pwResult.success) {
      throw CompositeValError.fromZodError(pwResult.error);
    }
  }

  public updatePassword(password: string) {
    const pwResult = z.string({ errorMap: unifyZodMessages('password') })
      .nonempty()
      .min(1)
      .refine(
        (id) => id === encodeURIComponent(id),
        'password contains unacceptable characters',
      ).safeParse(password);

    if (!pwResult.success) {
      throw CompositeValError.fromZodError(pwResult.error);
    }

    return new Credential(this.id, password);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    return other != null && this.id === other.id && this.password === other.password;
  }
}
