import { Enum } from '@hexa/common/types.ts';
import { ZodIssueOptionalMessage } from 'zod';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidOfEnum<T extends readonly unknown[]>(enumList: T, value: any): value is Enum<T> {
  return enumList.indexOf(value) > -1;
}

export function unifyZodMessages(message: string) {
  return (issue: ZodIssueOptionalMessage): { message: string } => {
    if ([
      'too_big',
      'too_small',
      'invalid_enum_value',
      'invalid_type',
    ].indexOf(issue.code) === -1) {
      return { message: issue.message ?? message };
    }

    if (issue.code === 'invalid_type' &&
      (issue.expected !== 'string' || [
        'null',
        'undefined',
        'never',
        'unknown',
        'void',
      ].indexOf(issue.received) === -1)) {
      return { message: issue.message ?? message };
    }

    return {
      message,
    };
  };
}
