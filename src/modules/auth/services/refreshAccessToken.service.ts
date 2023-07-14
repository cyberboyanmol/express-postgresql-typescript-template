import prisma from '../../../lib/prisma-client';
import { UserWithRefresh } from '../interfaces';

export class RefreshAccessTokenService {
  private readonly prisma = prisma;

  constructor() {
    this.prisma = prisma;
  }

  public async findUserBasedOnRefreshToken(refreshToken: string) {
    const user = (await this.prisma.refresh.findUnique({
      where: {
        refreshtoken: refreshToken,
      },
      include: {
        user: true,
      },
    })) as UserWithRefresh | null;

    return user?.user;
  }

  public async deleteAllRefreshTokenForUser(userId: string) {
    const deleteUser = await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        refreshTokens: {
          deleteMany: {},
        },
      },
    });
    return deleteUser;
  }

  public async removeRefreshToken(userId: string, refreshToken: string) {
    const updateUser = await this.prisma.user.update({
      where: {
        userId,
      },
      data: {
        refreshTokens: {
          delete: {
            refreshtoken: refreshToken,
          },
        },
      },
      include: {
        refreshTokens: true,
      },
    });

    return updateUser;
  }

  public async addRefreshToken(userId: string, newRefreshToken: string) {
    await this.prisma.refresh.create({
      data: {
        refreshtoken: newRefreshToken,
        user: {
          connect: {
            userId: userId,
          },
        },
      },
    });
  }
}
