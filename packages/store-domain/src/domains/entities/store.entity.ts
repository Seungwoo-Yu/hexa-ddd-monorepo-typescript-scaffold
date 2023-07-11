import { UlidUid } from '@hexa/store-domain/domains/vo/ulid-uid.vo.ts';
import { StoreDesc } from '@hexa/store-domain/domains/vo/store-desc.vo.ts';
import { StoreName } from '@hexa/store-domain/domains/vo/store-name.vo.ts';
import { IntegerUid } from '@hexa/store-domain/domains/vo/integer-uid.vo.ts';
import { AssertStaticInterface } from '@hexa/common/decorators.ts';
import { ClassOf, Validatable } from '@hexa/common/interfaces.ts';
import { UndefOrNullParamError } from '@hexa/common/errors/interface.ts';

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static validate(target: any) {
    if (target == null) {
      throw new UndefOrNullParamError('Item');
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
