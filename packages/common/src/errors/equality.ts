export class UndefOrNullParamError extends Error {
  constructor() {
    super('other is undefined or null');
  }
}
