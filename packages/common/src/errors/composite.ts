import { ZodError, ZodIssueCode } from 'zod';
import {
  InvalidEnumError,
  MaxElementLenError,
  MaxLengthError,
  MaxValueError, MinElementLenError,
  MinLengthError,
  MinValueError, InvalidUTCTimezoneError, UndefOrNullVarError, UnexpectedTypeError, InvalidDateTimeError,
} from '@hexa/common/errors/vo';

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

      if (issue.code === ZodIssueCode.too_big) {
        if (issue.type === 'number' || issue.type === 'bigint') {
          return new MaxValueError(issue.maximum, name);
        }
        if (issue.type === 'array') {
          return new MaxElementLenError(issue.maximum, name);
        }

        return new MaxLengthError(issue.maximum, name);
      }

      if (issue.code === ZodIssueCode.too_small) {
        if (issue.type === 'number' || issue.type === 'bigint') {
          return new MinValueError(issue.minimum, name);
        }
        if (issue.type === 'array') {
          return new MinElementLenError(issue.minimum, name);
        }

        return new MinLengthError(issue.minimum, name);
      }

      if (issue.code === ZodIssueCode.invalid_enum_value) {
        return new InvalidEnumError(issue.received + '', name);
      }

      if (issue.code === ZodIssueCode.invalid_type) {
        if ([
          'null',
          'undefined',
          'never',
          'unknown',
          'void',
        ].indexOf(issue.received) > -1) {
          return new UndefOrNullVarError(name);
        }

        return new UnexpectedTypeError(issue.expected, issue.received, name);
      }

      if (issue.code === ZodIssueCode.custom && issue.params?.code != null) {
        if (issue.params.code === 'INVALID_UTC_TIMEZONE') {
          return new InvalidUTCTimezoneError(name ?? issue.params.name);
        }

        if (issue.params.code === 'INVALID_DATETIME_TYPE') {
          return new InvalidDateTimeError(name ?? issue.params.name);
        }
      }

      return Error(issue.message);
    });

    return new CompositeValError(convertedErrors);
  }
}
