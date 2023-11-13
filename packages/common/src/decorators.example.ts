import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf } from '@hexa/common/interfaces';

// noinspection JSUnusedGlobalSymbols,SuspiciousTypeOfGuard
@AssertStaticInterface<ClassOf<ClassOfExample>>()
class ClassOfExample {
  constructor(
    public b: string,
  ) {}

  public static isClassOf(target: unknown): target is ClassOfExample {
    const expected = target as ClassOfExample;
    return expected?.b != null && typeof expected.b === 'string' &&
      expected.b !== '';
  }
}
