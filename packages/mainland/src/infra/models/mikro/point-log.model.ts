import { Entity, Enum, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Enum as EnumType } from '@hexa/common/types';
import { PointGainReason } from '@hexa/user-stat-context/domains/vo/gain-reason.vo';
import { PointLossReason } from '@hexa/user-stat-context/domains/vo/loss-reason.vo';
import { DateTimeType } from '@hexa/mainland/utils';
import { DateTime } from 'luxon';
import { UserModel } from '@hexa/mainland/infra/models/mikro/user.model';

@Entity()
export class PointLogModel {
  @PrimaryKey({ type: 'bigint', autoincrement: true })
  public uid!: number;

  @Enum({
    items: [...PointGainReason, ...PointLossReason],
    array: false,
  })
  public reason!: EnumType<typeof PointGainReason> | EnumType<typeof PointLossReason>;

  @Property({ type: 'float' })
  public amount!: number;

  @Property({ type: DateTimeType })
  public createdAt!: DateTime;

  @ManyToOne(() => UserModel)
  public user?: UserModel;
}
