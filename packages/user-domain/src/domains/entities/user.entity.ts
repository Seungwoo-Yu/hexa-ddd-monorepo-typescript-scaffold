import { Balance } from '@hexa/user-domain/domains/vo/balance.vo.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { UlidUid } from '@hexa/user-domain/domains/vo/ulid-uid.vo.ts';

export interface IUser {
  uid: UlidUid,
  credential: Credential,
  name: Name,
  balance: Balance,
}
