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
} from '@nestjs/common';
import { ShopService } from './shop.service';
import { CreateShopDto } from './dto/create-shop.dto';
import { UpdateShopStatusDto } from './dto/update-shop-status.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { RolesPermissionsGuard } from 'src/common/guards/rbac.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/common/enums/role.enum';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { ShopResponseDto } from './dto/shop-response.dto';

@Controller('shop')
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
  @Serialize(null, 'Get all shops successfully!')
  getAllShops(@Req() req) {
    return this.shopService.getAllShops();
  }

  @Get('/me')
  @Serialize(ShopResponseDto, 'Get all my shops successfully!')
  getAllMyShops(@Req() req) {
    return this.shopService.getAllMyShops(req.user.userId);
  }
}
