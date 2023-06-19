import { IUser } from '@hexa/user-domain/domains/entities/user.entity.ts';
import {
  PointGainLog, IPointLog,
  PointLossLog,
  PointGainReason,
  PointLossReason,
} from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum } from '@hexa/common/types.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';

export class UserAgg<T extends IUser> {
  constructor(
    public readonly user: T,
    public readonly pointLogs: IPointLog<T>[],
  ) {}

  public deposit(reason: Enum<typeof PointGainReason>, amount: number) {
    this.user.balance = this.user.balance.deposit(amount);
    this.pointLogs.push(new PointGainLog(this.user.uid, reason, amount));
  }

  public withdraw(reason: Enum<typeof PointLossReason>, amount: number) {
    this.user.balance = this.user.balance.withdraw(amount);
    this.pointLogs.push(new PointLossLog(this.user.uid, reason, amount));
  }

  public changeCredential(id: string, password: string) {
    const credential = new Credential(id, password);
    this.user.changeCredential(credential);
  }

  public changeName(nickname: string) {
    const credential = new Name(nickname);
    this.user.changeName(credential);
  }
}
