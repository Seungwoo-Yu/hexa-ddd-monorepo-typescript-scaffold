export interface ClassOf<T extends object> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isClassOf(target: any): target is T,
}

export interface IFactory<T extends object> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(...any: any[]): T | Promise<T>,
}
