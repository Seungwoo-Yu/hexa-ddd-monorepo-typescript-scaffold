import { Equality } from '@hexa/common/interfaces.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/equality.ts';

export class StoreDesc implements Equality {
  constructor(
    public readonly desc: string,
  ) {
    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .nonempty()
      .min(10)
      .max(100)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 < 6)
      .safeParse(desc);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError();
    }

    return this.desc == other.desc;
  }
}
