import { ClassOf, Equality, IFactory, Validatable } from '@hexa/common/interfaces.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { isValid as isValidUlid, ulid } from 'ulidx';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';

@AssertStaticInterface<ClassOf<UlidUid>>()
@AssertStaticInterface<Validatable>()
@AssertStaticInterface<IFactory<UlidUid>>()
export class UlidUid implements Equality {
  constructor(
    public readonly uid: string,
  ) {
    UlidUid.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError();
    }

    return this.uid == other.uid;
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('UlidUid');
    }

    const result = z.string({ errorMap: unifyZodMessages('uid') })
      .nonempty()
      .refine(_uid => isValidUlid(_uid))
      .safeParse(target.uid);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
