import { PickType } from '@hexa/common/types';
import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { StoadminAgg } from '@hexa/stoadmin-context/domains/aggs/stoadmin.agg';

export interface IStoadminCommand {
  create(stoadminAgg: StoadminAgg): Promise<void>,
  update(stoadminAgg: StoadminAgg): Promise<void>,
  delete(stoadminUid: PickType<Stoadmin, 'uid'>): Promise<void>,
}
