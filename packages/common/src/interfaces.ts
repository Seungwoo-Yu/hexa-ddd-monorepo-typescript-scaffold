import { ConsumedScope } from '@hexa/common/types';

export interface ClassOf<T extends object> {
  isClassOf(target: unknown): target is T,
}

export interface FactoryOf<T extends object> {
  create(...args: never[]): T | Promise<T>,
}

export interface GeneratorOf<T extends object> extends FactoryOf<T> {
  generate(...args: never[]): T | Promise<T>,
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
  validate(target: unknown): void,
}

export interface Equality {
  /**
   * @param other something to check if this is equal to it
   * @throws {UndefOrNullParamError} will be thrown when other is either undefined or null
   */
  equals(other: unknown): boolean,
}

/**
 * Scope means a combined job that several jobs inside it are treated as combined.
 * Scope must guarantee *atomicity* means that all the jobs inside it must be occurred together.
 * All they are not occurred or rolled back to the original state
 * in case of such an unexpected situations like runtime errors happen while running.
 */
export interface Scope {}

export interface ScopeOperation<T extends Scope> {
  /**
   * create new scope and run func inside it
   */
  runInScope(func: (scope: T) => Promise<void>): Promise<void>,
}

/**
 * Scope means a combined job that several jobs inside it are treated as combined.
 * Scope must guarantee *atomicity* means that all the jobs inside it must be occurred together,
 * and they all are not occurred or rolled back to the original state
 * in case of such an unexpected situations like runtime errors happen while running.
 *
 * Isolated scope means that changes inside a scope have not to be propagated to
 * all scopes in same level and child scopes as well.
 * but parent scopes can access the changes
 * as soon as entire scope in same level and child scopes are successfully occurred.
 */
export interface IsolatedScope {}

export interface IsolatedScopeOperation<T extends IsolatedScope> {
  /**
   * create new isolated scope and run func inside it
   */
  runInIsolatedScope(func: (scope: T) => Promise<void>): Promise<void>,
}

export interface ScopeConsumer<T extends (Scope | IsolatedScope)> {
  scope: ConsumedScope<T>,
  invoke(...args: unknown[]): Promise<void>,
  revoke(...args: unknown[]): Promise<void>,
}

/**
 * determine where new scope starts running jobs or other scopes on
 */
export interface ScopeStartOption<T extends Scope = Scope> {
  /**
   * start new scope in an open environment
   */
  start(...args: unknown[]): Promise<T>,
}

/**
 * determine where new scope starts running jobs or other scopes on
 */
export interface IsolatedScopeStartOption<T extends IsolatedScope = IsolatedScope> {
  /**
   * start new scope in an isolated environment like transaction in database
   */
  startIsolated(...args: unknown[]): Promise<T>,
}
