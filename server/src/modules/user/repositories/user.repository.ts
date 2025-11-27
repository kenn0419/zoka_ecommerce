import { Injectable } from '@nestjs/common';
import { Prisma, User } from 'generated/prisma';
import { UserStatus } from 'src/common/enums/user-status.enum';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private prisma: PrismaService) {}

  create(data: Prisma.UserCreateInput): Promise<User> {
    return this.prisma.user.create({ data });
  }

  findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findByPhone(phone: string): Promise<User | null> {
    return this.prisma.user.findUnique({ where: { phone } });
  }

  findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({ where });
  }

  findAllUsers(
    search: string | null = null,
    take: number = 10,
    skip: number = 0,
    sortBy: string[] = ['createdAt', 'desc'],
  ): Promise<User[]> {
    return this.prisma.user.findMany({
      skip,
      take,
      orderBy: {
        [sortBy[0]]: sortBy[1] === 'asc' ? 'asc' : 'desc',
      },
      ...(search
        ? {
            where: {
              OR: ['id', 'email', 'fullName', 'phone'].map((key) => ({
                [key]: { contains: search, mode: 'insensitive' },
              })),
            },
          }
        : {}),
    });
  }

  updateUser(
    where: Prisma.UserWhereUniqueInput,
    data: Prisma.UserUpdateInput,
  ): Promise<User> {
    return this.prisma.user.update({
      data,
      where,
    });
  }

  changeUserStatus(
    where: Prisma.UserWhereUniqueInput,
    status: string,
  ): Promise<User> {
    return this.prisma.user.update({
      data: {
        status,
      },
      where,
    });
  }

  deleteUser(where: Prisma.UserWhereUniqueInput): Promise<User> {
    return this.prisma.user.update({
      where,
      data: {
        status: UserStatus.BLOCK,
      },
    });
  }
}
