import { UserCredentialId } from '@hexa/mainland/app/vo/user-credential-id.vo';

export interface UserCheckerOutPort {
  exists(id: UserCredentialId): Promise<boolean>,
}
