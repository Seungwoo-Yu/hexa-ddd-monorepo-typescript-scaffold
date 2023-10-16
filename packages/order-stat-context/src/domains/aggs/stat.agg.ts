import { StatStore } from '@hexa/order-stat-context/domains/entities/stat-store.entity';
import { StatOrder } from '@hexa/order-stat-context/domains/vo/stat-order.vo';
import { OrderLine } from '@hexa/order-stat-context/domains/entities/order-line.entity';
import { PickType } from '@hexa/common/types';

export class NoStoreFoundError extends Error {
  constructor(storeUid: PickType<OrderLine, 'storeUid'>) {
    super('store ' + storeUid.uid + ' is not found');
  }
}

export class StatAgg {
  constructor(
    public readonly statStores: StatStore[] = [],
    public global: StatOrder = new StatOrder(),
  ) {
  }

  public updateOnCreatedOrder(orderLines: OrderLine[]) {
    orderLines.forEach(line => {
      this.global = new StatOrder(
        this.global.sales + line.priceDetail.finalPrice,
        this.global.salesVolume + 1,
        this.global.netSales + line.priceDetail.itemPrice,
        this.global.netSalesVolume + 1,
      );
      const statStoreIdx = this.statStores.findIndex(stat => stat.uid.equals(line.storeUid));

      if (statStoreIdx > -1) {
        const statStore = this.statStores[statStoreIdx];
        this.statStores[statStoreIdx].statOrder = new StatOrder(
          statStore.statOrder.sales + line.priceDetail.finalPrice,
          statStore.statOrder.salesVolume + 1,
          statStore.statOrder.netSales + line.priceDetail.itemPrice,
          statStore.statOrder.netSalesVolume + 1,
        );
      } else {
        this.statStores.push(
          new StatStore(
            line.storeUid,
            new StatOrder(
              line.priceDetail.finalPrice,
              1,
              line.priceDetail.itemPrice,
              1,
            ),
          ),
        );
      }
    });
  }

  public updateOnRefundedOrderLine(orderLine: OrderLine) {
    const statStoreIdx = this.statStores.findIndex(stat => stat.uid.equals(orderLine.storeUid));
    if (statStoreIdx === -1) {
      throw new NoStoreFoundError(orderLine.storeUid);
    }

    this.global = new StatOrder(
      this.global.sales,
      this.global.salesVolume,
      this.global.netSales - orderLine.priceDetail.itemPrice,
      this.global.netSalesVolume - 1,
    );

    const statStore = this.statStores[statStoreIdx];
    this.statStores[statStoreIdx].statOrder = new StatOrder(
      statStore.statOrder.sales,
      statStore.statOrder.salesVolume,
      statStore.statOrder.netSales - orderLine.priceDetail.itemPrice,
      statStore.statOrder.netSalesVolume - 1,
    );
  }
}
