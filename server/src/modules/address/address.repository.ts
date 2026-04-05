import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class AddressRepository {
  constructor(private prisma: PrismaService) {}

  createAddress(
    userId: string,
    addressText: string,
    receiverName: string,
    receiverPhone: string,
    isDefault?: boolean,
  ) {
    return this.prisma.address.create({
      data: {
        id: crypto.randomUUID(),
        userId,
        receiverName,
        receiverPhone,
        addressText,
        isDefault: isDefault ? true : false,
      },
    });
  }

  findDefaultByUserId(userId: string) {
    return this.prisma.address.findFirst({
      where: {
        userId,
        isDefault: true,
      },
    });
  }

  changeUserAddressDefault(id: string) {
    return this.prisma.address.update({
      where: { id },
      data: {
        isDefault: true,
      },
    });
  }

  findAllAdressByUserId(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
    });
  }

  update(
    where: Prisma.AddressWhereUniqueInput,
    data: Prisma.AddressUpdateInput,
  ) {
    return this.prisma.address.update({ where, data });
  }

  findUnique(where: Prisma.AddressWhereUniqueInput) {
    return this.prisma.address.findUnique({ where });
  }
}
