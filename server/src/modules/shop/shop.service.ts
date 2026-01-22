import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopStatusDto } from './dto/update-shop-status.dto';
import { ShopRepository } from './shop.repository';
import { RbacRepository } from '../rbac/rbac.repository';
import { ShopStatus } from 'src/common/enums/shop-status.enum';
import { UserRepository } from '../user/repositories/user.repository';
import { UploadService } from 'src/infrastructure/upload/upload.service';
import { ConfigService } from '@nestjs/config';
import { Role } from 'src/common/enums/role.enum';
import { SlugifyUtil } from 'src/common/utils/slugify.util';
import { Prisma } from 'generated/prisma';
import { buildSearchOr } from 'src/common/utils/build-search-or.util';
import { paginatedResult } from 'src/common/utils/pagninated-result.util';
import { buildShopSort } from 'src/common/utils/shop-sort.util';
import { ShopSort } from 'src/common/enums/shop-sort.enum';

@Injectable()
export class ShopService {
  constructor(
    private configService: ConfigService,
    private uploadService: UploadService,
    private shopRepo: ShopRepository,
    private userRepo: UserRepository,
    private rbacRepo: RbacRepository,
  ) {}

  async registerShop(
    userId: string,
    data: CreateShopDto,
    file?: Express.Multer.File,
  ) {
    const maxShopCount = Number(
      this.configService.get<string>('MAX_SHOP_COUNT'),
    );
    const shopCount = await this.shopRepo.countShopsByOwnerId(userId);
    if (shopCount >= maxShopCount) {
      throw new BadRequestException('You can only create maximum 3 shops.');
    }
    const existUser = await this.userRepo.findUnique({ id: userId });
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    let logoUrl: string | null = null;
    if (file) {
      const upload = await this.uploadService.uploadFile(
        file,
        this.configService.get<string>('SUPABASE_BUCKET_FOLDER_USER'),
      );
      logoUrl = upload.url;
    }
    const payload = {
      owner: { connect: { id: existUser.id } },
      name: data.name,
      slug: SlugifyUtil.createSlug(data.name),
      description: data.description,
      status: ShopStatus.PENDING,
      logoUrl,
    };
    const newShop = await this.shopRepo.createShop(payload);
    return newShop;
  }

  async adminUpdateShopStatus(shopId: string, dto: UpdateShopStatusDto) {
    const shop = await this.shopRepo.update(
      { id: shopId },
      { status: dto.status },
    );

    const shopRole = await this.rbacRepo.findRoleUnique({ name: Role.SHOP });
    if (shopRole && dto.status === ShopStatus.ACTIVE) {
      await this.rbacRepo.assignRole(shop.ownerId, shopRole?.id);
    }

    return shop;
  }

  async lockShop(ownerId: string, shopId: string) {
    const existShop = await this.findOne({ id: shopId });
    if (!existShop) {
      throw new NotFoundException('Shop not found.');
    }

    const isOwner = existShop.ownerId === ownerId;
    if (!isOwner) {
      throw new BadRequestException('You must be shop owner.');
    }

    const isStatus = existShop.status;
    if (isStatus !== ShopStatus.PENDING) {
      throw new BadRequestException('Shop is not approved yet.');
    }

    await this.shopRepo.update(
      { id: existShop.id },
      { status: ShopStatus.SUSPENDED },
    );
  }

  async activeShop(ownerId: string, shopId: string) {
    const existShop = await this.findOne({ id: shopId });
    if (!existShop) {
      throw new NotFoundException('Shop not found');
    }

    const isOwner = existShop.ownerId === ownerId;
    if (!isOwner) {
      throw new BadRequestException('You must be shop owner.');
    }

    const isStatus = existShop.status;
    if (isStatus === ShopStatus.PENDING) {
      throw new BadRequestException('Shop is not approved yet.');
    }

    await this.shopRepo.update(
      { id: existShop.id },
      { status: ShopStatus.ACTIVE },
    );
  }

  async findAllShops(
    search: string,
    page: number,
    limit: number,
    sort: ShopSort,
  ) {
    const where: Prisma.ShopWhereInput = {
      ...(search && {
        OR: buildSearchOr(search, ['name', 'id']),
      }),
    };

    return paginatedResult(
      {
        where,
        page,
        limit,
        orderBy: buildShopSort(sort),
      },
      (args) => this.shopRepo.listPaginatedShops(args),
    );
  }

  async findAllMyShops(ownerId: string) {
    return await this.shopRepo.findShopsByOwner(ownerId);
  }

  async findOne(
    where: Prisma.ShopWhereUniqueInput,
    select?: Prisma.ShopSelect,
  ) {
    const existShop = await this.shopRepo.findUnique(where, select);

    if (!existShop || existShop.status !== ShopStatus.ACTIVE) {
      console.log(existShop);
      throw new BadRequestException('Shop is approved yet.');
    }

    return existShop;
  }

  async findDetailShopBySlug(slug: string) {
    return this.findOne(
      { slug },
      {
        name: true,
        slug: true,
        description: true,
        status: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    );
  }
}
