export class MinLengthError extends Error {
  constructor(minLength: number | bigint = 0, name = 'variable') {
    super(name + ' must be longer than ' + minLength);
  }
}

export class MaxLengthError extends Error {
  constructor(maxLength: number | bigint = 0, name = 'variable') {
    super(name + ' must be shorter than ' + maxLength);
  }
}

export class MinValueError extends Error {
  constructor(minValue: number | bigint = 0, name = 'variable') {
    super(name + ' must be greater than or equal to ' + minValue);
  }
}

export class MaxValueError extends Error {
  constructor(maxValue: number | bigint = 0, name = 'variable') {
    super(name + ' must be less than or equal to ' + maxValue);
  }
}

export class MinElementLenError extends Error {
  constructor(minElementLen: number | bigint = 0, name = 'variable') {
    super(name + ` must contain at least ${minElementLen} elements`);
  }
}

export class MaxElementLenError extends Error {
  constructor(maxElementLen: number | bigint = 0, name = 'variable') {
    super(name + ` must contain at most ${maxElementLen} elements`);
  }
}

export class InvalidEnumError extends Error {
  constructor(value: string, name = '') {
    super((name === '' ? 'invalid value: ' : `invalid value of enum ${name}: `) + value);
  }
}


export class UndefOrNullVarError extends Error {
  constructor(name = 'variable') {
    super(name + ' is undefined or null');
  }
}

export class UnexpectedTypeError extends Error {
  constructor(expected: string, received: string, name = 'variable') {
    super(name + ' is ' + received + ' but ' + expected + ' is expected');
  }
}

export class InvalidUTCTimezoneError extends Error {
  constructor(name = 'variable') {
    super(name + ' must be utc-based');
  }
}

export class InvalidDateTimeError extends Error {
  constructor(name = 'variable') {
    super(name + ' is not DateTime');
  }
}
