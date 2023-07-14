import prisma from '@/lib/prisma-client';

import { UpdateUserDto } from './dtos/updateUser.dto';

export class UserService {
  private readonly prisma = prisma;

  constructor() {
    this.prisma = prisma;
  }

  public async getProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        userId,
      },
    });
    return { user };
  }

  public async updateUser(userId: string, updateData: UpdateUserDto) {
    console.log(updateData);

    const updateUser = await this.prisma.user.update({
      where: { userId },
      data: updateData,
    });
    return updateUser;
  }
}
