export class MinLengthError extends Error {
  constructor(minLength: number | bigint = 0, name = 'variable') {
    super(name + ' must be more than ' + minLength);
  }
}

export class MaxLengthError extends Error {
  constructor(maxLength: number | bigint = 0, name = 'variable') {
    super(name + ' must be less than ' + maxLength);
  }
}

export class MinValueError extends Error {
  constructor(minValue: number | bigint = 0, name = 'variable') {
    super(name + ' must be greater than ' + minValue);
  }
}

export class MaxValueError extends Error {
  constructor(maxValue: number | bigint = 0, name = 'variable') {
    super(name + ' must be less than ' + maxValue);
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


export class EmptyStringError extends Error {
  constructor(name = 'variable') {
    super(name + ' is empty string');
  }
}
