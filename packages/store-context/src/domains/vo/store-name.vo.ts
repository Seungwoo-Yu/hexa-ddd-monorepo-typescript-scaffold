import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { AssertStaticInterface } from '@hexa/common/decorators';

@AssertStaticInterface<ClassOf<StoreName>>()
@AssertStaticInterface<Validatable>()
export class StoreName implements Equality {
  constructor(
    public readonly name: string,
  ) {
    StoreName.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as StoreName;

    return this.name === expected.name;
  }

  public static isClassOf(target: unknown): target is StoreName {
    try {
      StoreName.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('StoreName');
    }
    const expected = target as StoreName;

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .min(1)
      .max(30)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 === 0)
      .safeParse(expected.name);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
