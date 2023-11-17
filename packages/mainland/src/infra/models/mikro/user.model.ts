import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

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
}
