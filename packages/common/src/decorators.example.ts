import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf } from '@hexa/common/interfaces';

// noinspection JSUnusedGlobalSymbols
@AssertStaticInterface<ClassOf<ClassOfExample>>()
class ClassOfExample {
  constructor(
    public b: string,
  ) {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static isClassOf(target: any): target is ClassOfExample {
    return typeof target.b != null && typeof target.b === 'string' &&
      target.b !== '';
  }
}
