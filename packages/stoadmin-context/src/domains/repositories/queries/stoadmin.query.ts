import { PickType } from '@hexa/common/types';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';
import { Credential } from '@hexa/stoadmin-context/domains/vo/credential.vo';

export interface IStoadminQuery {
  readByUid(uid: PickType<Stoadmin, 'uid'>): Promise<StoadminAgg | undefined>,
  readById(credentialId: PickType<Credential, 'id'>): Promise<StoadminAgg | undefined>,
  exists(uid: PickType<Stoadmin, 'uid'>): Promise<boolean>,
  existsById(credentialId: PickType<Credential, 'id'>): Promise<boolean>,
}
