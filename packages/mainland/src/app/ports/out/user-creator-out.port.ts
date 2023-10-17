import { User } from '@hexa/user-context/domains/entities/user.entity';

export interface UserCreatorOutPort {
  create(user: User): Promise<void>,
}
