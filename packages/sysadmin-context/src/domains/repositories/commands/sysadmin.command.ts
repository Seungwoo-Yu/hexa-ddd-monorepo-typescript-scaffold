import { Sysadmin } from '@hexa/sysadmin-context/domains/entities/sysadmin.entity';
import { PickType } from '@hexa/common/types';

export interface ISysadminCommand {
  create(sysadmin: Sysadmin): Promise<void>,
  update(sysadmin: Sysadmin): Promise<void>,
  delete(sysadminUid: PickType<Sysadmin, 'uid'>): Promise<void>,
}
