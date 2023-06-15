import { ZodError } from 'zod';
import {
  EmptyStringError,
  InvalidEnumError,
  MaxElementLenError,
  MaxLengthError,
  MaxValueError, MinElementLenError,
  MinLengthError,
  MinValueError,
} from '@hexa/common/errors/vo.ts';

export class CompositeValError extends Error {
  constructor(
    public readonly errors: Error[],
  ) {
    super(`composite validation error: ${errors.length} error(s) thrown.\n` +
      `main error: ${errors[0].message}`);
  }

  public static fromZodError(error: ZodError) {
    const convertedErrors = error.errors.map(issue => {
      const name = issue.message.indexOf(' ') === -1 ? issue.message : undefined;

      if (issue.code === 'too_big') {
        if (issue.type === 'number' || issue.type === 'bigint') {
          return new MaxValueError(issue.maximum, name);
        }
        if (issue.type === 'array') {
          return new MaxElementLenError(issue.maximum, name);
        }

        return new MaxLengthError(issue.maximum, name);
      }
      if (issue.code === 'too_small') {
        if (issue.type === 'number' || issue.type === 'bigint') {
          return new MinValueError(issue.minimum, name);
        }
        if (issue.type === 'array') {
          return new MinElementLenError(issue.minimum, name);
        }

        return new MinLengthError(issue.minimum, name);
      }
      if (issue.code === 'invalid_enum_value') {
        return new InvalidEnumError(issue.received + '', name);
      }
      if (issue.code === 'invalid_type') {
        if (issue.expected === 'string' &&
          [
            'null',
            'undefined',
            'never',
            'unknown',
            'void',
          ].indexOf(issue.received) > -1) {
          return new EmptyStringError(name);
        }
      }

      return Error(issue.message);
    });

    return new CompositeValError(convertedErrors);
  }
}
