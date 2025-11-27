import { Injectable } from '@nestjs/common';
import { Category, Prisma } from 'generated/prisma';
import { CategoryStatus } from 'src/common/enums/category-status.enum';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class CategoryRepository {
  constructor(private prisma: PrismaService) {}

  async createCategory(data: Prisma.CategoryCreateInput) {
    return await this.prisma.category.create({ data });
  }

  async findAllCategories(
    search: string,
    take: number,
    skip: number,
    sortBy: string[],
  ): Promise<Category[]> {
    return await this.prisma.category.findMany({
      skip,
      take,
      orderBy: {
        [sortBy[0]]: sortBy[1] === 'asc' ? 'asc' : 'desc',
      },
      where: search
        ? {
            OR: ['id', 'name', 'description'].map((key) => ({
              [key]: { contains: search, mode: 'insensitive' },
            })),
          }
        : undefined,
      include: { children: true, parent: true },
    });
  }

  findUnique(where: Prisma.CategoryWhereUniqueInput) {
    return this.prisma.category.findUnique({
      where,
      include: { parent: true, children: true, products: true },
    });
  }

  update(slug: string, data: Prisma.CategoryUpdateInput) {
    return this.prisma.category.update({
      where: { slug },
      data,
    });
  }

  delete(slug: string) {
    return this.prisma.category.update({
      where: { slug },
      data: { status: CategoryStatus.INACTIVE },
    });
  }

  activate(slug: string) {
    return this.prisma.category.update({
      where: { slug },
      data: { status: CategoryStatus.ACTIVE },
    });
  }

  deactivate(slug: string) {
    return this.prisma.category.update({
      where: { slug },
      data: { status: CategoryStatus.INACTIVE },
    });
  }

  findRootCategories() {
    return this.prisma.category.findMany({
      where: { parentId: null, status: 'ACTIVE' },
      include: { children: true },
    });
  }

  findChildren(parentId: string) {
    return this.prisma.category.findMany({
      where: { parentId, status: 'ACTIVE' },
      include: { children: true },
    });
  }
}
