import { Enum } from '@hexa/common/types.ts';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isValidOfEnum<T extends readonly unknown[]>(enumList: T, value: any): value is Enum<T> {
  return enumList.indexOf(value) > -1;
}
