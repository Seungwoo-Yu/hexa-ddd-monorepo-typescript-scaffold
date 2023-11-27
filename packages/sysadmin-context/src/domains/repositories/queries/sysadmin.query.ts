import { PickType } from '@hexa/common/types';
import { Sysadmin } from '@hexa/sysadmin-context/domains/entities/sysadmin.entity';
import { Credential } from '@hexa/sysadmin-context/domains/vo/credential.vo';

export interface ISysadminQuery {
  readByUid(uid: PickType<Sysadmin, 'uid'>): Promise<Sysadmin | undefined>,
  readById(credentialId: PickType<Credential, 'id'>): Promise<Sysadmin | undefined>,
  exists(uid: PickType<Sysadmin, 'uid'>): Promise<boolean>,
  existsById(credentialId: PickType<Credential, 'id'>): Promise<boolean>,
}
