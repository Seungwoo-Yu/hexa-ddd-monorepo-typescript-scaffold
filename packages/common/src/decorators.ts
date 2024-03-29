export function AssertStaticInterface<T>() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <U extends { new(...args: any[]): any } & T>(constructor: U) => constructor;
}
