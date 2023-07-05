import { Equality } from '@hexa/common/interfaces.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';

export class StoreName implements Equality {
  constructor(
    public readonly name: string,
  ) {
    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .nonempty()
      .min(1)
      .max(30)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 === 0)
      .safeParse(name);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError();
    }

    return this.name == other.name;
  }
}
