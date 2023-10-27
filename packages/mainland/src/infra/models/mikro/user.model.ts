import { Collection, Entity, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { PointLogModel } from '@hexa/mainland/infra/models/mikro/point-log.model';

@Entity()
export class UserModel {
  @PrimaryKey({ type: 'char', length: 26 })
  public uid!: string;

  @Property({ type: 'varchar', length: 100, unique: true })
  public id!: string;

  @Property({ type: 'varchar', length: 300 })
  public password!: string;

  @Property({ type: 'varchar', length: 100 })
  public nickname!: string;

  @Property({ type: 'float', default: 0 })
  public balance!: number;

  @OneToMany(() => PointLogModel, log => log.user)
  public logs = new Collection<PointLogModel>(this);
}
