import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseInterceptors,
  UploadedFile,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopStatusDto } from './dto/update-shop-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { ShopResponseDto } from './dto/shop-response.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { ShopQueryDto } from './dto/shop-query.dto';

@Controller('shops')
@UseGuards(JwtSessionGuard, RolesPermissionsGuard)
export class ShopController {
  constructor(private readonly shopService: ShopService) {}

  @Post('/register')
  @UseInterceptors(FileInterceptor('logo'))
  @Serialize(
    null,
    'Registered shop successfully. Please wait admin for approving!',
  )
  async create(
    @Req() req,
    @Body() createShopDto: CreateShopDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    return await this.shopService.registerShop(
      req.user.userId,
      createShopDto,
      file,
    );
  }

  @Patch('/:shopId/change-status')
  @Roles(Role.ADMIN)
  @Serialize(null, 'Approved shop successfully!')
  async updateShopStatus(
    @Param('shopId') shopId: string,
    @Body() dto: UpdateShopStatusDto,
  ) {
    return await this.shopService.adminUpdateShopStatus(shopId, dto);
  }

  @Patch('/lock/:shopId')
  @Roles(Role.SHOP)
  @Serialize(null, 'Lock shop successfully!')
  async lockShop(@Req() req, @Param('shopId') shopId: string) {
    return await this.shopService.lockShop(req.user.userId, shopId);
  }

  @Patch('/active/:shopId')
  @Roles(Role.SHOP)
  @Serialize(null, 'Active shop successfully!')
  async activeShop(@Req() req, @Param('shopId') shopId: string) {
    return await this.shopService.activeShop(req.user.useId, shopId);
  }

  @Get()
  @Roles(Role.ADMIN)
  @SerializePaginated(ShopResponseDto, 'Get all shops successfully!')
  getAllShops(@Query() query: ShopQueryDto) {
    return this.shopService.findAllShops(
      query.search,
      query.page,
      query.limit,
      query.sort,
    );
  }

  @Get('/me')
  @Serialize(ShopResponseDto, 'Get all my shops successfully!')
  fetchAllMyShops(@Req() req) {
    return this.shopService.findAllMyShops(req.user.userId);
  }

  @Get('/public/:slug')
  @Serialize(ShopResponseDto, 'Get detail shop successfully!')
  fetchDetailShopBySlug(@Param('slug') shopSlug: string) {
    return this.shopService.findDetailShopBySlug(shopSlug);
  }
}
