import { IntegerUid } from '@hexa/stoadmin-context/domains/vo/integer-uid.vo';
import { StoreName } from '@hexa/stoadmin-context/domains/vo/store-name.vo';
import { StoreDesc } from '@hexa/stoadmin-context/domains/vo/store-desc.vo';
import { AssertStaticInterface } from '@hexa/common/decorators';
import { ClassOf, Validatable } from '@hexa/common/interfaces';
import { UndefOrNullParamError } from '@hexa/common/errors/interface';
import { UlidUid } from '@hexa/stoadmin-context/domains/vo/ulid-uid.vo';

@AssertStaticInterface<ClassOf<Store>>()
@AssertStaticInterface<Validatable>()
export class Store {
  constructor(
    public readonly uid: IntegerUid,
    public readonly name: StoreName,
    public readonly description: StoreDesc,
    public readonly adminUid: UlidUid,
  ) {
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
