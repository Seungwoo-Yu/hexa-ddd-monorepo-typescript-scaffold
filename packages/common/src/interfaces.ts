export interface ClassOf<T extends object> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  isClassOf(target: any): target is T,
}

export interface IFactory<T extends object> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  create(...any: any[]): T | Promise<T>,
}

export interface Validatable {
  validate(): boolean,
}

export interface Equality {
  /**
   * @param other something to check if this is equal to it
   * @throws {UndefOrNullParamError} Will be thrown when other is either undefined or null
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equals(other: any): boolean,
}
