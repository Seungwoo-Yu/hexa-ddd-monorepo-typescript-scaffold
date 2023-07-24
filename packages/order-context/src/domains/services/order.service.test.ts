import { InMemoryOrderRepo } from '@hexa/order-context/tests/mocks';
import { UlidUid } from '@hexa/order-context/domains/vo/ulid-uid.vo';
import { IncrIntegerFactory } from '@hexa/common/utils';
import { OrderService } from '@hexa/order-context/domains/services/order.service';
import { PriceDetail } from '@hexa/order-context/domains/vo/price-detail.vo';

describe('order-context order service test', () => {
  it('should create successfully', async () => {
    const incrIntegerFactory = new IncrIntegerFactory();
    const repo = new InMemoryOrderRepo(incrIntegerFactory);
    const service = new OrderService(repo, repo);
    const stores = repo.setOrderStores([
      {
        name: 'store',
        adminUid: UlidUid.create(),
      },
    ]);
    const stoits = repo.setOrderStoits([
      {
        name: 'store item',
        description: 'description',
        storeUid: stores[0].uid,
      },
    ]);
    const orderAgg = await service.create(
      {
        userUid: UlidUid.create(),
      },
      [
        {
          storeUid: stores[0].uid,
          stoitUid: stoits[0].uid,
          priceDetail: new PriceDetail(10000),
        },
      ],
      stoits,
      stores,
    );

    expect(orderAgg.order.uid.uid).toStrictEqual(2);
    expect(orderAgg.lines.length).toStrictEqual(1);
    expect(orderAgg.lines[0].uid.uid).toStrictEqual(3);
    expect(orderAgg.stores.length).toStrictEqual(1);
    expect(orderAgg.stores[0].uid.uid).toStrictEqual(stores[0].uid.uid);
    expect(orderAgg.stoits.length).toStrictEqual(1);
    expect(orderAgg.stoits[0].uid.uid).toStrictEqual(stoits[0].uid.uid);
  });
});
