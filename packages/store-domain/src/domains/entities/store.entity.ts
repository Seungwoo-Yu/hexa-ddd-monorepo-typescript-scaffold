import { UlidUid } from '@hexa/store-domain/domains/vo/ulid-uid.vo.ts';
import { StoreDesc } from '@hexa/store-domain/domains/vo/store-desc.vo.ts';
import { StoreName } from '@hexa/store-domain/domains/vo/store-name.vo.ts';
import { IntegerUid } from '@hexa/store-domain/domains/vo/integer-uid.vo.ts';

export class Store {
  constructor(
    public readonly uid: IntegerUid,
    public name: StoreName,
    public description: StoreDesc,
    public adminUid: UlidUid,
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
}
