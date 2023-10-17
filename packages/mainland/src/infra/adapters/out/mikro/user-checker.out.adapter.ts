import { UserCheckerOutPort } from '@hexa/mainland/app/ports/out/user-checker.out.port';
import { UserCredentialId } from '@hexa/mainland/app/vo/user-credential-id.vo';
import { User } from '@hexa/mainland/infra/models/mikro/user.model';
import { BaseMikroAdapter } from '@hexa/mainland/infra/adapters/out/mikro/base.adapter';

export class UserCheckerOutMikroAdapter extends BaseMikroAdapter implements UserCheckerOutPort {
  public async exists(id: UserCredentialId): Promise<boolean> {
    const result = await this.em.findOne(User, { id: id.id });

    return result != null;
  }
}
