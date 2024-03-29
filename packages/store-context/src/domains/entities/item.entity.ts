import { PickType } from '@hexa/common/types';
import { Store } from '@hexa/store-context/domains/entities/store.entity';
import { Price } from '@hexa/store-context/domains/vo/price.vo';
import { ItemDesc } from '@hexa/store-context/domains/vo/item-desc.vo';
import { ItemName } from '@hexa/store-context/domains/vo/item-name.vo';
import { IntegerUid } from '@hexa/store-context/domains/vo/integer-uid.vo';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<Item>>()
@AssertStaticInterface<Validatable>()
export class Item {
  constructor(
    public readonly uid: IntegerUid,
    public name: ItemName,
    public description: ItemDesc,
    public price: Price,
    public readonly storeUid: PickType<Store, 'uid'>,
  ) {
    Item.validate(this);
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

  public static isClassOf(target: unknown): target is Item {
    try {
      Item.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Item');
    }
    const expected = target as Item;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);

    if (expected.name == null) {
      throw new UndefOrNullParamError('name');
    }
    ItemName.validate(expected.name);

    if (expected.description == null) {
      throw new UndefOrNullParamError('description');
    }
    ItemDesc.validate(expected.description);

    if (expected.price == null) {
      throw new UndefOrNullParamError('price');
    }
    Price.validate(expected.price);

    if (expected.storeUid == null) {
      throw new UndefOrNullParamError('storeUid');
    }
    IntegerUid.validate(expected.storeUid);
  }
}
