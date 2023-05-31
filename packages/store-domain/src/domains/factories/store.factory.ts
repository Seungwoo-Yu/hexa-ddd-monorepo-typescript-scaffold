import { IStore } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { IItem } from '@hexa/store-domain/domains/entities/item.entity.ts';
import { StoreAgg } from '@hexa/store-domain/domains/aggs/store.agg.ts';
import { IStoreAggCommand } from '@hexa/store-domain/ports/out/commands/store-agg.command.ts';
import { IStoreCommand } from '@hexa/store-domain/ports/out/commands/store.command.ts';
import { OrderedMap } from 'immutable';
import { IFactory } from '@hexa/common/interfaces.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';

@AssertStaticInterface<IFactory<StoreAgg<IStore, IItem>>>()
export class StoreFactory {
  static async create<T extends IStore, U extends IItem>(
    storeCommand: IStoreCommand<T>,
    storeAggCommand: IStoreAggCommand<U>,
    _store: Omit<T, 'id'>,
    _items: Omit<U, 'id' | 'storeId'>[],
  ) {
    const store = await storeCommand.create(_store);
    const items = _items == null || _items.length === 0
      ? []
      : await storeAggCommand.createItems(_items.map(item => {
        return {
          ...item,
          storeId: store.id,
        } as Omit<U, 'id'>;
      }));

    return new StoreAgg(
      storeAggCommand,
      store,
      OrderedMap(items.map(value => [value.id, value])),
    );
  }
}
