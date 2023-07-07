import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';

@AssertStaticInterface<ClassOf<StoreDesc>>()
@AssertStaticInterface<Validatable>()
export class StoreDesc implements Equality {
  constructor(
    public readonly desc: string,
  ) {
    StoreDesc.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.desc === other.desc;
  }

  public static isClassOf(target: unknown): target is StoreDesc {
    try {
      StoreDesc.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('StoreDesc');
    }

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .nonempty()
      .min(10)
      .max(100)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 < 6)
      .safeParse(target.desc);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
