import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Equality, IFactory, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';

@AssertStaticInterface<ClassOf<StatPoint>>()
@AssertStaticInterface<Validatable>()
@AssertStaticInterface<IFactory<StatPoint>>()
export class StatPoint implements Equality {
  constructor(
    public readonly charged: number,
    public readonly returned: number,
  ) {
    StatPoint.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as StatPoint;

    return this.charged === expected.charged && this.returned === expected.returned;
  }

  public static create() {
    return new StatPoint(0, 0);
  }

  public static isClassOf(target: unknown): target is StatPoint {
    try {
      StatPoint.validate(target);
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
    const expected = target as StatPoint;

    const chargedResult = z.number({ errorMap: unifyZodMessages('charged') })
      .min(0)
      .safeParse(expected.charged);

    if (!chargedResult.success) {
      throw CompositeValError.fromZodError(chargedResult.error);
    }

    const returnedResult = z.number({ errorMap: unifyZodMessages('returned') })
      .min(0)
      .safeParse(expected.returned);

    if (!returnedResult.success) {
      throw CompositeValError.fromZodError(returnedResult.error);
    }
  }
}
