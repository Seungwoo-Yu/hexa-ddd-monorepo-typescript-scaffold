import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';

@AssertStaticInterface<ClassOf<ItemName>>()
@AssertStaticInterface<Validatable>()
export class ItemName implements Equality {
  constructor(
    public readonly name: string,
  ) {
    ItemName.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.name === other.item;
  }

  public static isClassOf(target: unknown): target is ItemName {
    try {
      ItemName.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('ItemName');
    }

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .nonempty()
      .min(1)
      .max(20)
      .refine(desc => desc.match(/(\r\n|\r|\n)/g)?.length ?? 0 === 0)
      .safeParse(target.name);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
