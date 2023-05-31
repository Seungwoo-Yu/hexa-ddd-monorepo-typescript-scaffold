export function AssertStaticInterface<T>() {
  return <U extends { new(...args: never[]): V } & T, V>(_: U, __: ClassDecoratorContext) => undefined;
}
