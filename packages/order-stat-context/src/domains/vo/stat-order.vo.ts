import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Equality, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { z } from 'zod';
import { unifyZodMessages } from '@hexa/common/utils';
import { CompositeValError } from '@hexa/common/errors/composite';

@AssertStaticInterface<ClassOf<StatOrder>>()
@AssertStaticInterface<Validatable>()
export class StatOrder implements Equality {
  constructor(
    public readonly sales = 0,
    public readonly salesVolume = 0,
    public readonly netSales = 0,
    public readonly netSalesVolume = 0,
  ) {
  }

  public equals(other: unknown): boolean {
    if (other == null) {
      throw new UndefOrNullParamError('other');
    }
    const expected = other as StatOrder;

    return this.sales === expected.sales &&
      this.salesVolume === expected.salesVolume &&
      this.netSales === expected.salesVolume &&
      this.netSalesVolume === expected.netSalesVolume;
  }

  public static isClassOf(target: unknown): target is StatOrder {
    try {
      StatOrder.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('StatOrder');
    }
    const expected = target as StatOrder;

    const salesResult = z.number({ errorMap: unifyZodMessages('sales') })
      .int()
      .min(0)
      .safeParse(expected.sales);

    if (!salesResult.success) {
      throw CompositeValError.fromZodError(salesResult.error);
    }

    const salesVolumeResult = z.number({ errorMap: unifyZodMessages('salesVolume') })
      .int()
      .min(0)
      .safeParse(expected.salesVolume);

    if (!salesVolumeResult.success) {
      throw CompositeValError.fromZodError(salesVolumeResult.error);
    }

    const netSalesResult = z.number({ errorMap: unifyZodMessages('netSales') })
      .int()
      .min(0)
      .safeParse(expected.netSales);

    if (!netSalesResult.success) {
      throw CompositeValError.fromZodError(netSalesResult.error);
    }

    const netSalesVolumeResult = z.number({ errorMap: unifyZodMessages('netSalesVolumeResult') })
      .int()
      .min(0)
      .safeParse(expected.sales);

    if (!netSalesVolumeResult.success) {
      throw CompositeValError.fromZodError(netSalesVolumeResult.error);
    }
  }
}
