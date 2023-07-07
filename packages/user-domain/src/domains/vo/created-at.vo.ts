import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { ClassOf, Equality, IFactory, Validatable } from '@hexa/common/interfaces.ts';
import { DateTime } from 'luxon';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';
import { unifyZodMessages, ZodDateTime } from '@hexa/common/utils.ts';
import { CompositeValError } from '@hexa/common/errors/composite.ts';

@AssertStaticInterface<ClassOf<CreatedAt>>()
@AssertStaticInterface<Validatable>()
@AssertStaticInterface<IFactory<CreatedAt>>()
export class CreatedAt implements Equality {
  constructor(
    public readonly dateTime: DateTime,
  ) {
    CreatedAt.validate(this);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError();
    }

    return this.dateTime.equals(other);
  }

  public static create() {
    return new CreatedAt(DateTime.now().toUTC());
  }

  public static isClassOf(target: unknown): target is CreatedAt {
    try {
      CreatedAt.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target?.dateTime == null) {
      throw new UndefOrNullParamError('CreatedAt');
    }

    const result = ZodDateTime.create('createdAt', name => ({ errorMap: unifyZodMessages(name) }))
      .isUTC().safeParse(target.dateTime);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}