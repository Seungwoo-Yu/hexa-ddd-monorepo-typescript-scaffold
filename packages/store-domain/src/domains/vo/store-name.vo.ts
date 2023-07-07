import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';

@AssertStaticInterface<ClassOf<StoreName>>()
@AssertStaticInterface<Validatable>()
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
      throw new UndefOrNullParamError('other');
    }

    return this.name === other.name;
  }

  public static isClassOf(target: unknown): target is StoreName {
    try {
      StoreName.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('StoreName');
    }

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .nonempty()
      .min(1)
      .max(30)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 === 0)
      .safeParse(target.name);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
