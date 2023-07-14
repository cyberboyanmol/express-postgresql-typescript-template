import type { Refresh, User } from '@prisma/client';

export interface UserWithRefresh extends Refresh {
  user: User;
}
