import { PickType } from '@hexa/common/types';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';

export interface IStoadminQuery {
  readById(id: PickType<Stoadmin, 'uid'>): Promise<StoadminAgg | undefined>,
  exists(id: PickType<Stoadmin, 'uid'>): Promise<boolean>,
}
