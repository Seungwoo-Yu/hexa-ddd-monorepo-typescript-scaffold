import { User } from '@hexa/user-domain/domains/entities/user.entity';
import { PointGainLog, IPointLog, PointLossLog } from '@hexa/user-domain/domains/vo/point-log.vo';
import { Credential } from '@hexa/user-domain/domains/vo/credential.vo';
import { Name } from '@hexa/user-domain/domains/vo/name.vo';

export class UserAgg {
  constructor(
    public readonly user: User,
    public readonly pointLogs: IPointLog[],
  ) {}

  public deposit(log: PointGainLog) {
    this.user.balance = this.user.balance.deposit(log.amount);
    this.pointLogs.push(log);
  }

  public withdraw(log: PointLossLog) {
    this.user.balance = this.user.balance.withdraw(log.amount);
    this.pointLogs.push(log);
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
