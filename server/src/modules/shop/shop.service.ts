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
    const existUser = await this.userRepo.findUnique({ id: userId });
    if (!existUser) {
      throw new NotFoundException('User not found');
    }
    const existedShop = await this.shopRepo.getShopByOwner(existUser.id);
    if (existedShop) {
      throw new ForbiddenException('User already has a shop');
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
      description: data.description,
      status: ShopStatus.PENDING,
      logoUrl,
    };
    return await this.shopRepo.createShop(payload);
  }

  async adminUpdateShopStatus(shopId: string, dto: UpdateShopStatusDto) {
    const shop = await this.shopRepo.update(
      { id: shopId },
      { status: dto.status },
    );

    if (dto.status === ShopStatus.ACTIVE) {
      await this.rbacRepo.ensureRole(shop.ownerId, Role.SHOP);
    }

    return shop;
  }

  async lockShop(ownerId: string) {
    const existShop = await this.shopRepo.getShopByOwner(ownerId);
    if (!existShop) {
      throw new NotFoundException('Shop not found');
    }

    const isStatus = existShop.status;
    if (isStatus !== ShopStatus.PENDING) {
      throw new BadRequestException('Shop is not approved yet.');
    }

    await this.shopRepo.update(
      { id: existShop.id },
      { status: ShopStatus.INACTIVE },
    );
  }

  async activeShop(ownerId: string) {
    const existShop = await this.shopRepo.getShopByOwner(ownerId);
    if (!existShop) {
      throw new NotFoundException('Shop not found');
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
}
