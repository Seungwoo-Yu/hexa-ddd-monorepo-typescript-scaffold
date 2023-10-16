import { StatPoint } from '@hexa/user-stat-context/domains/vo/stat-point.vo';
import { DailyStat } from '@hexa/user-stat-context/domains/entities/daily-stat.entity';
import { OrderLine } from '@hexa/user-stat-context/domains/entities/order-line.entity';
import { OrderedMap } from 'immutable';
import { PickNestedType, PickType } from '@hexa/common/types';
import { DailyStatUid } from '@hexa/user-stat-context/domains/vo/daily-stat-uid.vo';

export class NoDailyStatFoundError extends Error {
  constructor(expectedUid: PickType<DailyStat, 'uid'>) {
    super('daily stat ' + expectedUid + ' is not found');
  }
}

export class StatAgg {
  constructor(
    public readonly dailyStats: DailyStat[] = [],
    public dailyStatIdxMap = OrderedMap<PickNestedType<DailyStat, ['uid', 'uid']>, number>(),
    public global: StatPoint,
  ) {}

  public async updateOnCreatedOrder(orderLines: OrderLine[]) {
    const charged = orderLines.reduce((previousValue, currentValue) => {
      return previousValue + (currentValue?.priceDetail.finalPrice ?? 0);
    }, this.global.charged);
    this.global = new StatPoint(charged, this.global.returned);

    orderLines.forEach(line => {
      const uid = DailyStatUid.create(line.orderCreatedAt.dateTime);
      const idx = this.dailyStatIdxMap.get(uid.uid);
      const existed = idx == null ? undefined : this.dailyStats[idx];
      if (idx == null || existed == null) {
        this.dailyStatIdxMap.set(line.uid.uid, this.dailyStats.length);
        const created = new DailyStat(uid, new StatPoint(line.priceDetail.finalPrice, 0));
        this.dailyStats.push(created);
        return;
      }

      this.dailyStats[idx] = new DailyStat(
        uid,
        new StatPoint(
          existed.statPoint.charged + line.priceDetail.finalPrice,
          existed.statPoint.returned,
        ),
      );
    });
  }

  public async updateOnRefundedOrderLine(orderLine: OrderLine) {
    const charged = this.global.charged + orderLine.priceDetail.finalPrice;
    this.global = new StatPoint(charged, this.global.returned);

    const uid = DailyStatUid.create(orderLine.orderCreatedAt.dateTime);
    const idx = this.dailyStatIdxMap.get(uid.uid);
    const existed = idx == null ? undefined : this.dailyStats[idx];
    if (idx == null || existed == null) {
      throw new NoDailyStatFoundError(uid);
    }

    this.dailyStats[idx] = new DailyStat(
      uid,
      new StatPoint(
        existed.statPoint.charged,
        existed.statPoint.returned + orderLine.priceDetail.finalPrice,
      ),
    );
  }
}
