import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  async createUserSession(data: {
    id: string;
    userId: string;
    device?: string;
    ipAddress?: string;
    publicKey: string;
    privateKey: string;
    refreshToken: string;
    expiresAt: Date;
  }) {
    return this.prisma.userSession.create({ data });
  }

  async findById(id: string) {
    return this.prisma.userSession.findUnique({ where: { id } });
  }

  async findByRefreshToken(refreshToken: string) {
    return this.prisma.userSession.findFirst({
      where: { refreshToken, isRevoked: false },
    });
  }

  async updateSession(id: string, data: Prisma.UserSessionUpdateInput) {
    return this.prisma.userSession.update({
      where: { id },
      data,
    });
  }

  async revokeSession(id: string) {
    return this.prisma.userSession.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  async revokeAll(userId: string) {
    return this.prisma.userSession.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }
}
