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

  findUnique(where: Prisma.UserWhereUniqueInput): Promise<User | null> {
    return this.prisma.user.findUnique({
      where,
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });
  }

  async listPaginatedUsers(params: {
    where: Prisma.UserWhereInput;
    limit: number;
    page: number;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }) {
    const { where, limit, page, orderBy } = params;
    const skip = (page - 1) * limit;

    const [items, totalItems] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy,
      }),
      this.prisma.user.count({ where }),
    ]);

    return { items, totalItems };
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
