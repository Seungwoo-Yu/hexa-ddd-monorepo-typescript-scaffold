import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { unifyZodMessages } from '@hexa/common/utils';
import { z } from 'zod';
import { CompositeValError } from '@hexa/common/errors/composite';

@AssertStaticInterface<ClassOf<PriceDetail>>()
@AssertStaticInterface<Validatable>()
export class PriceDetail implements Equality {
  public readonly finalPrice: number;
  constructor(
    public readonly itemPrice: number,
    public readonly discountPrice = 0,
    public readonly tax = 0,
  ) {
    const cost = (itemPrice - discountPrice);
    this.finalPrice = cost + Math.floor(cost * tax);
    PriceDetail.validate(this);
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as PriceDetail;

    return this.itemPrice === expected.itemPrice
      && this.discountPrice === expected.discountPrice
      && this.tax === expected.tax
      && this.finalPrice === expected.finalPrice;
  }

  public static isClassOf(target: unknown): target is PriceDetail {
    try {
      PriceDetail.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('PriceDetail');
    }
    const expected = target as PriceDetail;

    const itemResult = z.number({ errorMap: unifyZodMessages('itemPrice') })
      .int()
      .min(0)
      .safeParse(expected.itemPrice);

    if (!itemResult.success) {
      throw CompositeValError.fromZodError(itemResult.error);
    }

    const discountResult = z.number({ errorMap: unifyZodMessages('discountPrice') })
      .int()
      .min(0)
      .max(expected.itemPrice ?? 0)
      .safeParse(expected.itemPrice);

    if (!discountResult.success) {
      throw CompositeValError.fromZodError(discountResult.error);
    }

    const taxResult = z.number({ errorMap: unifyZodMessages('tax') })
      .min(0)
      .safeParse(expected.itemPrice);

    if (!taxResult.success) {
      throw CompositeValError.fromZodError(taxResult.error);
    }
  }
}
