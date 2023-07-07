import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';

@AssertStaticInterface<ClassOf<IntegerUid>>()
@AssertStaticInterface<Validatable>()
export class IntegerUid implements Equality {
  constructor(
    public readonly uid: number,
  ) {
    IntegerUid.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.uid === other.uid;
  }

  public static isClassOf(target: unknown): target is IntegerUid {
    try {
      IntegerUid.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('IntegerUid');
    }

    const result = z.number({ errorMap: unifyZodMessages('uid') })
      .int()
      .safeParse(target.uid);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
