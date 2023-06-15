import { z } from 'zod';
import { Equality } from '@hexa/common/interfaces.ts';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';

export class Name implements Equality {
  constructor(
    public readonly nickname: string,
  ) {
    const result = z.string({ errorMap: unifyZodMessages('nickname') })
      .min(5)
      .max(20)
      .refine(
        (id) => id === encodeURIComponent(id),
        'nickname contains unacceptable characters',
      )
      .safeParse(nickname);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): other is this {
    return other != null && this.nickname === other.nickname;
  }
}

