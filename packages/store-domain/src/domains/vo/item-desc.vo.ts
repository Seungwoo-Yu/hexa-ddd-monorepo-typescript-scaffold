import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { AssertStaticInterface } from '@hexa/common/decorators';

@AssertStaticInterface<ClassOf<ItemDesc>>()
@AssertStaticInterface<Validatable>()
export class ItemDesc implements Equality {
  constructor(
    public readonly desc: string,
  ) {
    ItemDesc.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.desc === other.desc;
  }

  public static isClassOf(target: unknown): target is ItemDesc {
    try {
      ItemDesc.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('ItemDesc');
    }

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .nonempty()
      .min(10)
      .max(30)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 < 3)
      .safeParse(target.desc);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
