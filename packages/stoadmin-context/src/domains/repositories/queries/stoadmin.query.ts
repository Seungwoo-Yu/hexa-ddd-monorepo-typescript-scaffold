import { PickType } from '@hexa/common/types';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';

export interface IStoadminQuery {
  readByUid(uid: PickType<Stoadmin, 'uid'>): Promise<StoadminAgg | undefined>,
  exists(uid: PickType<Stoadmin, 'uid'>): Promise<boolean>,
}
