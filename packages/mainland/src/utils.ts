import { Type, ValidationError } from '@mikro-orm/core';
import { DateTime } from 'luxon';

export class DateTimeType extends Type<DateTime, string> {
  public convertToDatabaseValue(value: DateTime | string): string {
    if (DateTime.isDateTime(value)) {
      return value.toUTC().toISO()!;
    }

    if (value != null) {
      return value;
    }

    throw ValidationError.invalidType(DateTimeType, value, 'JS');
  }

  public convertToJSValue(value: DateTime | string): DateTime {
    if (DateTime.isDateTime(value)) {
      return value;
    }

    if (value != null) {
      return DateTime.fromISO(value);
    }

    throw ValidationError.invalidType(DateTimeType, value, 'database');
  }

  public getColumnType(): string {
    return 'timestamp';
  }
}

export function isRunningOnTsNode() {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  return !!process[Symbol.for('ts-node.register.instance')];
}
