import { OrderLine, RefundedOrderLineError } from '@hexa/order-context/domains/entities/order-line.entity';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { IntegerUid } from '@hexa/order-context/domains/vo/integer-uid.vo';
import { PriceDetail } from '@hexa/order-context/domains/vo/price-detail.vo';
import { RefundReason } from '@hexa/order-context/domains/vo/refund-reason.vo';
import { CreatedAt } from '@hexa/order-context/domains/vo/created-at.vo';

describe('order-context order-line entity test', () => {
  it('should refund successfully', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const line = new OrderLine(
      new IntegerUid(incrIntegerFactory.next()),
      new IntegerUid(incrIntegerFactory.next()),
      new IntegerUid(incrIntegerFactory.next()),
      new IntegerUid(incrIntegerFactory.next()),
      new PriceDetail(10000),
    );

    line.refund(new RefundReason('requested_by_store_admin'));

    expect(line.refundReason);
    expect(line.refundReason).not.toBeUndefined();
    expect(line.refundReason).not.toBeNull();
    expect(line.refundReason!.reason).toStrictEqual('requested_by_store_admin');
    expect(line.refundCreatedAt).not.toBeUndefined();
    expect(line.refundCreatedAt).not.toBeNull();
    expect(CreatedAt.isClassOf(line.refundCreatedAt)).toStrictEqual(true);
  });

  it('should not refund again', () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const line = new OrderLine(
      new IntegerUid(incrIntegerFactory.next()),
      new IntegerUid(incrIntegerFactory.next()),
      new IntegerUid(incrIntegerFactory.next()),
      new IntegerUid(incrIntegerFactory.next()),
      new PriceDetail(10000),
    );

    line.refund(new RefundReason('requested_by_user'));

    expect(() => line.refund(
      new RefundReason('requested_by_store_admin'),
    )).toThrowError(new RefundedOrderLineError(line.uid));
  });
});
