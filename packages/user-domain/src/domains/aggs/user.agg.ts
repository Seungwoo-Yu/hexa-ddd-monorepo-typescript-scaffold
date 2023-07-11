import { User } from '@hexa/user-domain/domains/entities/user.entity.ts';
import { PointGainLog, IPointLog, PointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo.ts';
import { Enum } from '@hexa/common/types.ts';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo.ts';
import { Name } from '@hexa/user-domain/domains/vo/name.vo.ts';
import { GainReason, PointGainReason } from '@hexa/user-domain/domains/vo/gain-reason.vo.ts';
import { Amount } from '@hexa/user-domain/domains/vo/amount.vo.ts';
import { CreatedAt } from '@hexa/user-domain/domains/vo/created-at.vo.ts';
import { LossReason, PointLossReason } from '@hexa/user-domain/domains/vo/loss-reason.vo.ts';

export class UserAgg {
  constructor(
    public readonly user: User,
    public readonly pointLogs: IPointLog[],
  ) {}

  public deposit(reason: Enum<typeof PointGainReason>, amount: number) {
    this.user.balance = this.user.balance.deposit(amount);
    this.pointLogs.push(new PointGainLog(
      this.user.uid,
      new GainReason(reason),
      new Amount(amount),
      CreatedAt.create(),
    ));
  }

  public withdraw(reason: Enum<typeof PointLossReason>, amount: number) {
    this.user.balance = this.user.balance.withdraw(amount);
    this.pointLogs.push(new PointLossLog(
      this.user.uid,
      new LossReason(reason),
      new Amount(amount),
      CreatedAt.create(),
    ));
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
