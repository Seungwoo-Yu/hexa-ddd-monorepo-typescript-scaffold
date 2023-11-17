export interface RepositoryFactory<T extends Readonly<Array<unknown>>> {
  readonly repos: T,
  createRepo(...args: unknown[]): T,
}
