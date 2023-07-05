export class UndefOrNullParamError extends Error {
  constructor(name = 'param') {
    super(name + ' is undefined or null');
  }
}
