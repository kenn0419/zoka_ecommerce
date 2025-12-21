import { Injectable } from '@nestjs/common';
import { Prisma } from 'generated/prisma';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AuthRepository {
  constructor(private prisma: PrismaService) {}

  createUserSession(data: {
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

  findById(id: string) {
    return this.prisma.userSession.findUnique({ where: { id } });
  }

  findByRefreshToken(refreshToken: string) {
    return this.prisma.userSession.findFirst({
      where: { refreshToken, isRevoked: false },
    });
  }

  updateSession(id: string, data: Prisma.UserSessionUpdateInput) {
    return this.prisma.userSession.update({
      where: { id },
      data,
    });
  }

  revokeSession(id: string) {
    return this.prisma.userSession.update({
      where: { id },
      data: { isRevoked: true },
    });
  }

  revokeAll(userId: string) {
    return this.prisma.userSession.updateMany({
      where: { userId },
      data: { isRevoked: true },
    });
  }
}
