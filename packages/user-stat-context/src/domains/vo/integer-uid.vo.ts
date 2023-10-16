import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { AssertStaticInterface } from '@hexa/common/decorators';

@AssertStaticInterface<ClassOf<IntegerUid>>()
@AssertStaticInterface<Validatable>()
export class IntegerUid implements Equality {
  constructor(
    public readonly uid: number,
  ) {
    IntegerUid.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as IntegerUid;

    return this.uid === expected.uid;
  }

  public static isClassOf(target: unknown): target is IntegerUid {
    try {
      IntegerUid.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('IntegerUid');
    }
    const expected = target as IntegerUid;

    const result = z.number({ errorMap: unifyZodMessages('uid') })
      .int()
      .safeParse(expected.uid);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
