import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';

// Order sto(re) it(em)
export class OrderStoit {
  constructor(
    public readonly uid: IntegerUid,
    public readonly name: string,
    public readonly description: string,
    public readonly storeUid: IntegerUid,
  ) {
    OrderStoit.validate(this);
  }

  public static isClassOf(target: unknown): target is OrderStoit {
    try {
      OrderStoit.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('OrderStoit');
    }
    const expected = target as OrderStoit;

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

    const descriptionResult = z.string({ errorMap: unifyZodMessages('description') })
      .min(1)
      .safeParse(expected.name);

    if (!descriptionResult.success) {
      throw CompositeValError.fromZodError(descriptionResult.error);
    }

    if (expected.storeUid == null) {
      throw new UndefOrNullParamError('storeUid');
    }
    IntegerUid.validate(expected.storeUid);
  }
}
