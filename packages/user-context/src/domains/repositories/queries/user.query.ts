import { User } from '@hexa/user-context/domains/entities/user.entity';
import { PickType } from '@hexa/common/types';
import { Credential } from '@hexa/user-context/domains/vo/credential.vo';

export interface IUserQuery {
  readByUid(uid: PickType<User, 'uid'>): Promise<User | undefined>,
  readById(credentialId: PickType<Credential, 'id'>): Promise<User | undefined>,
  exists(uid: PickType<User, 'uid'>): Promise<boolean>,
  existsById(credentialId: PickType<Credential, 'id'>): Promise<boolean>,
}
