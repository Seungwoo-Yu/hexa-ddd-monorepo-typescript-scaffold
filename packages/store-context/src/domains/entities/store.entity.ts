import { UlidUid } from '@hexa/store-context/domains/vo/ulid-uid.vo';
import { StoreDesc } from '@hexa/store-context/domains/vo/store-desc.vo';
import { StoreName } from '@hexa/store-context/domains/vo/store-name.vo';
import { IntegerUid } from '@hexa/store-context/domains/vo/integer-uid.vo';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';

@AssertStaticInterface<ClassOf<Store>>()
@AssertStaticInterface<Validatable>()
export class Store {
  constructor(
    public readonly uid: IntegerUid,
    public name: StoreName,
    public description: StoreDesc,
    public readonly adminUid: UlidUid,
  ) {
  }

  public changeName(name: StoreName) {
    if (this.name.equals(name)) {
      throw new Error('name is not changed');
    }

    this.name = name;
  }

  public changeDesc(desc: StoreDesc) {
    if (this.description.equals(desc)) {
      throw new Error('description is not changed');
    }

    this.description = desc;
  }

  public static isClassOf(target: unknown): target is Store {
    try {
      Store.validate(target);
    } catch (ignored) {
      return false;
    }

    return true;
  }

  public static validate(target: unknown) {
    if (target == null) {
      throw new UndefOrNullParamError('Store');
    }
    const expected = target as Store;

    if (expected.uid == null) {
      throw new UndefOrNullParamError('uid');
    }
    IntegerUid.validate(expected.uid);

    if (expected.name == null) {
      throw new UndefOrNullParamError('name');
    }
    StoreName.validate(expected.name);

    if (expected.description == null) {
      throw new UndefOrNullParamError('description');
    }
    StoreDesc.validate(expected.description);

    if (expected.adminUid == null) {
      throw new UndefOrNullParamError('adminUid');
    }
    UlidUid.validate(expected.adminUid);
  }
}
