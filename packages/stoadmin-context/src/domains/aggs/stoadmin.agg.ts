import { Stoadmin } from '@hexa/stoadmin-context/domains/entities/stoadmin.entity';
import { Store } from '@hexa/stoadmin-context/domains/entities/stoadmin-store.entity';

export class StoadminAgg {
  constructor(
    public readonly stoadmin: Stoadmin,
    public readonly stores: Store[],
  ) {}
}
