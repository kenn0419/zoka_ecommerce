import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { ShopRepository } from '../shop/shop.repository';
import { ProductRepository } from '../product/repositories/product.repository';
import { ShopStatus } from '@prisma/client';

@Injectable()
export class CatalogService {
  constructor(
    private readonly shopRepo: ShopRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async findShopByProductSlug(slug: string) {
    const product = await this.productRepo.findUnique({ slug });
    if (!product) throw new NotFoundException('Product not found');
    const isActive = product.shop.status === ShopStatus.ACTIVE;
    if (!isActive) {
      throw new ForbiddenException('Shop is not active currently.');
    }
    return this.shopRepo.findUnique(
      { id: product.shopId },
      {
        name: true,
        slug: true,
        description: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
        owner: {
          select: {
            id: true,
          },
        },
      },
    );
  }
}
