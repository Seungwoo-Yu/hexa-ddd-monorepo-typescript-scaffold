import { StatAgg } from '@hexa/user-stat-context/domains/aggs/stat.agg';

export interface IStatCommand {
  createOrUpdate(statAgg: StatAgg): Promise<void>,
}
