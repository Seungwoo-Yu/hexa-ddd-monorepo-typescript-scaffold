import { Column, Entity, PrimaryColumn } from 'typeorm';

@Entity()
export class UserModel {
  @PrimaryColumn({ type: 'char', length: 26 })
  public uid!: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  public id!: string;

  @Column({ type: 'varchar', length: 300 })
  public password!: string;

  @Column({ type: 'varchar', length: 100 })
  public nickname!: string;

  @Column({ type: 'float', default: 0 })
  public balance!: number;
}
