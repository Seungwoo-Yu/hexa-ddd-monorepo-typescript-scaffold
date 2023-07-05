import { Equality } from '@hexa/common/interfaces.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';

export class IntegerUid implements Equality {
  constructor(
    public readonly uid: number,
  ) {
    const result = z.number({ errorMap: unifyZodMessages('uid') })
      .int()
      .safeParse(uid);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError();
    }

    return this.uid === other.uid;
  }
}
