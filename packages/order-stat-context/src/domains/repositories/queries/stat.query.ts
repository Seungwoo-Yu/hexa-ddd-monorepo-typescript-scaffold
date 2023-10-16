import { StatAgg } from '@hexa/order-stat-context/domains/aggs/stat.agg';

export interface IStatQuery {
  read(): Promise<StatAgg>,
}
