import { ClassOf, Equality, FactoryOf, Validatable } from '@hexa/common/interfaces';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { isValid as isValidUlid, ulid } from 'ulidx';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<UlidUid>>()
@AssertStaticInterface<Validatable>()
@AssertStaticInterface<FactoryOf<UlidUid>>()
export class UlidUid implements Equality {
  constructor(
    public readonly uid: string,
  ) {
    UlidUid.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as UlidUid;

    return this.uid === expected.uid;
  }

  public static create() {
    return new UlidUid(ulid());
  }

  public static isClassOf(target: unknown): target is UlidUid {
    try {
      UlidUid.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('UlidUid');
    }
    const expected = target as UlidUid;

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .min(1)
      .refine(_uid => isValidUlid(_uid))
      .safeParse(expected.uid);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
