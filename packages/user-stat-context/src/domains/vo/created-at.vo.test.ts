import { DateTime } from 'luxon';
import { CreatedAt } from '@hexa/user-stat-context/domains/vo/created-at.vo';

describe('create-at vo test', () => {
  it('should create', () => {
    const dateTime = DateTime.now().toUTC();
    const createdAt = new CreatedAt(dateTime);

    expect(createdAt.dateTime.equals(dateTime)).toStrictEqual(true);
  });

  it('should not create because dateTime is not utc-based', async () => {
    const dateTime = DateTime.now();

    expect(() => new CreatedAt(dateTime)).toThrowError('createdAt must be utc-based');
  });

  it('should not create because dateTime is string', async () => {
    const dateTime = DateTime.now().toISO() as unknown as DateTime;

    expect(() => new CreatedAt(dateTime)).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: createdAt is string but object is expected');
  });

  it('should not create because dateTime is number', async () => {
    const dateTime = DateTime.now().toMillis() as unknown as DateTime;

    expect(() => new CreatedAt(dateTime)).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: createdAt is number but object is expected');
  });

  it('should not create because dateTime is object but not instance of DateTime', async () => {
    const dateTime = DateTime.now().toJSDate() as unknown as DateTime;

    expect(() => new CreatedAt(dateTime)).toThrowError('composite validation error: 1 error(s) thrown.\n' +
      'main error: createdAt is not DateTime');
  });
});
