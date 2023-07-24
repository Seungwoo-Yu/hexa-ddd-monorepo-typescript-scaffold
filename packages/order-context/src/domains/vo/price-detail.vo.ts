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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public equals(other: any): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }

    return this.itemPrice === other.itemPrice
      && this.discountPrice === other.discountPrice
      && this.tax === other.tax
      && this.finalPrice === other.finalPrice;
  }

  public static isClassOf(target: unknown): target is PriceDetail {
    try {
      PriceDetail.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('PriceDetail');
    }

    const itemResult = z.number({ errorMap: unifyZodMessages('itemPrice') })
      .int()
      .min(0)
      .safeParse(target.itemPrice);

    if (!itemResult.success) {
      throw CompositeValError.fromZodError(itemResult.error);
    }

    const discountResult = z.number({ errorMap: unifyZodMessages('discountPrice') })
      .int()
      .min(0)
      .max(target.itemPrice ?? 0)
      .safeParse(target.itemPrice);

    if (!discountResult.success) {
      throw CompositeValError.fromZodError(discountResult.error);
    }

    const taxResult = z.number({ errorMap: unifyZodMessages('tax') })
      .min(0)
      .safeParse(target.itemPrice);

    if (!taxResult.success) {
      throw CompositeValError.fromZodError(taxResult.error);
    }
  }
}
