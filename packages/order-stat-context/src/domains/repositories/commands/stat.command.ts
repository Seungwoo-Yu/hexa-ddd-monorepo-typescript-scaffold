import { StatAgg } from '@hexa/order-stat-context/domains/aggs/stat.agg';

export interface IStatCommand {
  createOrUpdate(statAgg: StatAgg): Promise<void>,
}
