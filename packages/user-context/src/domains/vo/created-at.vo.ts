import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Equality, IFactory, Validatable } from '@hexa/common/interfaces';
import { DateTime } from 'luxon';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { unifyZodMessages, ZodDateTime } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';

@AssertStaticInterface<ClassOf<CreatedAt>>()
@AssertStaticInterface<Validatable>()
@AssertStaticInterface<IFactory<CreatedAt>>()
export class CreatedAt implements Equality {
  constructor(
    public readonly dateTime: DateTime,
  ) {
    CreatedAt.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as CreatedAt;

    return this.dateTime.equals(expected.dateTime);
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

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('CreatedAt');
    }
    const expected = target as CreatedAt;

    const result = ZodDateTime.create('createdAt', name => ({ errorMap: unifyZodMessages(name) }))
      .isUTC().safeParse(expected.dateTime);

    if (!result.success) {
      throw CompositeValError.fromZodError(result.error);
    }
  }
}
