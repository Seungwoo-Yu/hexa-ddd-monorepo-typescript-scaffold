import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { AssertStaticInterface } from '@hexa/common/decorators';

@AssertStaticInterface<ClassOf<StoreDesc>>()
@AssertStaticInterface<Validatable>()
export class StoreDesc implements Equality {
  constructor(
    public readonly desc: string,
  ) {
    StoreDesc.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as StoreDesc;

    return this.desc === expected.desc;
  }

  public static isClassOf(target: unknown): target is StoreDesc {
    try {
      StoreDesc.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('StoreDesc');
    }
    const expected = target as StoreDesc;

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .min(10)
      .max(100)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 < 6)
      .safeParse(expected.desc);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
