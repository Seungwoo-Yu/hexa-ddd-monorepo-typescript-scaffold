import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { UlidUid } from '@hexa/order-context/domains/vo/ulid-uid.vo';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';

export class OrderStore {
  constructor(
    public readonly uid: IntegerUid,
    public readonly name: string,
    public readonly adminUid: UlidUid,
  ) {
    OrderStore.validate(this);
  }

  public static isClassOf(target: unknown): target is OrderStore {
    try {
      OrderStore.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('OrderStore');
    }
    const expected = target as OrderStore;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);

    const nameResult = z.string({ errorMap: unifyZodMessages('name') })
      .min(1)
      .safeParse(expected.name);

    if (!nameResult.success) {
      throw CompositeValError.fromZodError(nameResult.error);
    }

    if (expected.adminUid == null) {
      throw new UndefOrNullParamError('adminUid');
    }
    UlidUid.validate(expected.adminUid);
  }
}
