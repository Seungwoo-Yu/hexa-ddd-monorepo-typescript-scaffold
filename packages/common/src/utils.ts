import { Enum } from '@hexa/common/types';
import {
  addIssueToContext,
  ParseInput,
  ParseReturnType,
  ProcessedCreateParams,
  ZodErrorMap, ZodIssueCode,
  ZodIssueOptionalMessage, ZodParsedType,
  ZodType,
  ZodTypeDef,
} from 'zod';
import { DateTime } from 'luxon';

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

    if (issue.code === 'invalid_type') {
      if (([
        'null',
        'undefined',
        'never',
        'unknown',
        'void',
      ].indexOf(issue.received) === -1)) {
        return { message: issue.message ?? message };
      }

      return { message: issue.message ?? message };
    }

    return {
      message,
    };
  };
}

export class ZodDateTime extends ZodType<DateTime, ZodTypeDef, DateTime> {
  constructor(
    private readonly name = 'DateTime',
    params: ProcessedCreateParams,
  ) {
    super(params);
  }

  public static create(
    name = 'DateTime',
    params?: ZodTypeDef | ((name: string) => ZodTypeDef),
  ) {
    return new ZodDateTime(name, ZodDateTime.processCreateParams(
      typeof params === 'function' ? params(name) : params,
    ));
  }

  /**
   * Based on {@link https://github.com/colinhacks/zod/blob/3.18/src/types.ts#L109}
   */
  private static processCreateParams(params?: ZodTypeDef): ProcessedCreateParams {
    if (!params) return {};
    const {
      errorMap,
      description,
    } = params;
    if (errorMap) return { errorMap: errorMap, description };
    const customMap: ZodErrorMap = (iss, ctx) => {
      if (iss.code !== 'invalid_type') return { message: ctx.defaultError };
      if (iss.received === 'object') return { message: 'Expected DateTime, received object but not Datetime' };
      return { message: `Expected DateTime, received ${iss.received}` };
    };
    return { errorMap: customMap, description };
  }

  /**
   * Based on {@link https://github.com/colinhacks/zod/blob/3.18/src/types.ts#L482}
   */
  public _parse(input: ParseInput): ParseReturnType<DateTime> {
    const type = this._getTypeCustom(input);
    const ctx = this._getOrReturnCtx(input);

    if (type !== 'object') {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: type,
      });
      return {
        status: 'aborted',
      };
    }

    if (!DateTime.isDateTime(input.data)) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.custom,
        params: {
          code: 'INVALID_DATETIME_TYPE',
        },
      });
      return {
        status: 'aborted',
      };
    }

    return {
      status: 'valid',
      value: input.data,
    };
  }

  public _getTypeCustom(input: ParseInput): ZodParsedType {
    if (typeof input.data === 'object') {
      return ZodParsedType.object;
    }
    if (typeof input.data === 'string') {
      return ZodParsedType.string;
    }
    if (typeof input.data === 'number') {
      return ZodParsedType.number;
    }
    if (typeof input.data === 'bigint') {
      return ZodParsedType.bigint;
    }
    if (typeof input.data === 'symbol') {
      return ZodParsedType.symbol;
    }
    if (typeof input.data === 'undefined') {
      return ZodParsedType.undefined;
    }
    if (typeof input.data === 'function') {
      return ZodParsedType.function;
    }

    return ZodParsedType.unknown;
  }

  public isUTC() {
    return this.refine(
      date => date.zoneName === 'UTC',
      {
        message: 'Timezone of ' + this.name + ' is not UTC',
        params: { name: this.name, code: 'INVALID_UTC_TIMEZONE' },
      },
    );
  }
}

/**
 * Use for test only
 */
export class IncrIntegerFactory {
  private increment = 0;

  public next() {
    return this.increment++;
  }
}
