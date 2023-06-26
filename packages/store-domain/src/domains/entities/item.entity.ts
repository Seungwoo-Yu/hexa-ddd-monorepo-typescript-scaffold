import { PickAndType } from '@hexa/common/types.ts';
import { Store } from '@hexa/store-domain/domains/entities/store.entity.ts';
import { Price } from '@hexa/store-domain/domains/vo/price.vo.ts';
import { ItemDesc } from '@hexa/store-domain/domains/vo/item-desc.vo.ts';
import { ItemName } from '@hexa/store-domain/domains/vo/item-name.vo.ts';
import { IntegerUid } from '@hexa/store-domain/domains/vo/integer-uid.vo.ts';

export class Item {
  constructor(
    public uid: IntegerUid,
    public name: ItemName,
    public description: ItemDesc,
    public price: Price,
    public storeUid: PickAndType<Store, 'uid'>,
  ) {
  }

  public changeName(name: ItemName) {
    if (this.name.equals(name)) {
      throw new Error('name is not changed');
    }

    this.name = name;
  }

  public changeDesc(desc: ItemDesc) {
    if (this.description.equals(desc)) {
      throw new Error('description is not changed');
    }

    this.description = desc;
  }

  public changePrice(price: Price) {
    if (this.price.equals(price)) {
      throw new Error('price is not changed');
    }

    this.price = price;
  }
}
