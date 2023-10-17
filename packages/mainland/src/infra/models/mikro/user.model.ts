import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { PointLog } from '@hexa/mainland/infra/models/mikro/point-log.model';

@Entity()
export class User {
  @PrimaryKey({ type: 'char', length: 26 })
  public uid!: string;

  @Property({ type: 'varchar', length: 100 })
  public id!: string;

  @Property({ type: 'varchar', length: 300 })
  public password!: string;

  @Property({ type: 'varchar', length: 100 })
  public nickname!: string;

  @Property({ type: 'float', default: 0 })
  public balance!: number;

  @OneToMany(() => PointLog, log => log.user)
  public logs = new Collection<PointLog>(this);
}
