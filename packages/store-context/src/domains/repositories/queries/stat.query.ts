import { StatAgg } from '@hexa/user-stat-context/domains/aggs/stat.agg';

export interface IStatQuery {
  read(): Promise<StatAgg>,
}
