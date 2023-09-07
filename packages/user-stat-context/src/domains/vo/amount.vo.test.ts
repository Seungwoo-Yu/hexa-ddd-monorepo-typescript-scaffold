import { Amount } from '@hexa/user-stat-context/domains/vo/amount.vo';

describe('amount vo test', () => {
  it('should create successfully', () => {
    const amount = new Amount(1);

    expect(amount.amount).toStrictEqual(1);
  });

  it('should not create because it is less than', function () {
    expect(() => new Amount(0)).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: amount must be greater than or equal to 1');
  });

  it('should not create because it cannot be negative value', function () {
    expect(() => new Amount(-1)).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: amount must be greater than or equal to 1');
  });
});
