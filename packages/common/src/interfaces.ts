export interface ClassOf<T extends object> {
  isClassOf(target: unknown): target is T,
}

export interface IFactory<T extends object> {
  create(...args: never[]): T | Promise<T>,
}

export interface Validatable {
  /**
   * @param target something to check if it is valid or not
   * @throws {MinLengthError} will be thrown when target is shorter than expected length
   * @throws {MaxLengthError} will be thrown when target is longer than expected length
   * @throws {MinValueError} will be thrown when target is less than expected value
   * @throws {MaxValueError} will be thrown when target is greater than expected value
   * @throws {MinElementLenError} will be thrown when target contains fewer elements than expected
   * @throws {MaxElementLenError} will be thrown when target container more elements than expected
   * @throws {InvalidEnumError} will be thrown when expected enum does not contain target
   * @throws {UndefOrNullParamError} will be thrown when target is either undefined or null
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validate(target: any): void,
}

export interface Equality {
  /**
   * @param other something to check if this is equal to it
   * @throws {UndefOrNullParamError} will be thrown when other is either undefined or null
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  equals(other: any): boolean,
}
